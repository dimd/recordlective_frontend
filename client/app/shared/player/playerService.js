(function() {

  'use strict';

  function playerService($interval, $rootScope, $q, $filter, youtubeAPIService) {

    var ps = {};

    ps.artist = null;
    ps.currentlyPlaying = null;
    ps.currentTime = null;
    ps.init = init;
    ps.isActive = isActive;
    ps.muted = false;
    ps.playing = false;
    ps.playlist = [];
    ps.playNext = playNext;
    ps.playPrevious = playPrevious;
    ps.playSelected = playSelected;
    ps.ready = false;
    ps.release = null;
    ps.showControls = false;
    ps.stop = stop;
    ps.ytplayer = null;
    ps.zap = zap;
    
    function init(tracklist, ytplayer) {
      //console.log(ytplayer);

      var artist = tracklist.data.results.release.artist,
          artistName = tracklist.data.results.release.artist_credit_name,
          release = tracklist.data.results.release,
          tracklist = tracklist.data.results.tracklist,
          finalTracklist = [],
          videoPromises = [];

      function searchVideos(track) {
        return youtubeAPIService
          .search(artistName + ' ' + track.title)
          .then(function(searchResults) {

            return {
              videoIds: searchResults.data,
              duration: Math.floor(track.length/1000),
              term: artistName + ' ' + track.title,
              track: track
            };

          });
      }

      function getVideos(result) {
        var videos = [];

        return youtubeAPIService
          .video(result.videoIds)
          .then(function(videosResults) {

            videos = $filter('trackDuration')(videosResults.data, result.duration);
            videos = $filter('trackDescription')(videos, result.term);

            result.track.videos = videos.reverse();
            result.track.selectedVideo = 0;

            return result.track;

          });
      }

      tracklist.forEach(function(track) {

        var promise = searchVideos(track)
          .then(getVideos)
          .then(function(track) {
            finalTracklist.push(track);
          });

        videoPromises.push(promise);

      });

      // Finalization.
      $q.all(videoPromises)
        .then(function() {
          ps.artist = artist;
          ps.release = release;
          ps.playlist = $filter('orderBy')(finalTracklist, 'position');
          ps.ready = true;
          ps.showControls = true;
          ps.currentlyPlaying = ps.playlist[0];
          //console.log(ps.playlist);
        });

    }

    function isActive(track) {
      return track === ps.currentlyPlaying;
    }

    function hasNext() {
      return ps.playlist.indexOf(ps.currentlyPlaying) + 1 < ps.playlist.length;
    }

    function hasPrevious() {
      return ps.playlist.indexOf(ps.currentlyPlaying) - 1 > -1;
    }

    function playNext() {
      if (hasNext()) {
        ps.currentlyPlaying = ps.playlist[ps.playlist.indexOf(ps.currentlyPlaying) + 1];
      } else {
        ps.currentlyPlaying = null;
        ps.ytplayer.stopVideo();
        ps.ytplayer.clearVideo();
        ps.playing = false;
      }
    }

    function playPrevious() {
      if (hasPrevious()) {
        ps.currentlyPlaying = ps.playlist[ps.playlist.indexOf(ps.currentlyPlaying) - 1];
      } else {
        ps.currentlyPlaying = null;
        ps.ytplayer.stopVideo();
        ps.ytplayer.clearVideo();
        ps.playing = false;
      }
    }

    function playSelected(track) {
      ps.currentlyPlaying = track;
    }

    function stop() {
      ps.ytplayer.pauseVideo();
      ps.ytplayer.seekTo(0); 
    }

    function zap() {
      ps.currentlyPlaying.selectedVideo = (ps.currentlyPlaying.selectedVideo + 1) % ps.currentlyPlaying.videos.length;
    }

    $rootScope.$on('youtube.player.playing', function(event) {
      if (!ps.currentlyPlaying) {
        ps.currentlyPlaying = ps.playlist[0];
      }

      ps.timer = $interval(function() { ps.currentTime = ps.ytplayer.getCurrentTime(); }, 500);
      ps.playing = true;
    });

    $rootScope.$on('youtube.player.paused', function(event) {
      $interval.cancel(ps.timer);
      ps.playing = false;
    });

    $rootScope.$on('youtube.player.ended', function(event) {
      ps.playNext();
      $interval.cancel(ps.timer);
    });

    return ps;

  }

  playerService.$inject = ['$interval', '$rootScope', '$q', '$filter', 'youtubeAPIService'];

  angular.module('player')
    .factory('playerService', playerService);

})();
