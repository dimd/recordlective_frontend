(function() {

  'use strict';

  function trackDuration() {
    return function(tracks,duration) {
      var filtered = [];

      angular.forEach(tracks, function(track) {
        if (track.duration > duration - 2 && track.duration < duration + 6) {
          filtered.push(track);
        }
      });

      return filtered;
    };
  }

  function trackDescription() {
    return function(tracks, term) {
      var filtered = [],
          nonAlpha = '[^a-zA-Z]',
          excludedTerms = [
            'live',
            "guitar",
            "bass",
            "drums{0,1}",
            "cover",
            "show",
            "concert",
            "perform",
            "remix"
          ],
          liveRegExp = new RegExp('live', 'i'),
          lyricsRegExp = new RegExp('lyrics', 'i');

      var giantRegExp = new RegExp(
          excludedTerms
            .map(function(value) { 
              return nonAlpha + value + nonAlpha; 
            })
            .join('|'), 
      'i');

      if (!giantRegExp.test(term)) {

        var i, track, arrLength = tracks.length;

        for (i=0; i < arrLength; i++) {
          track = tracks[i]; 

          if (lyricsRegExp.test(track.description) || lyricsRegExp.test(track.title)) {
            filtered.push(track);
            continue;
          }

          if (!giantRegExp.test(track.title)) {
            filtered.push(track);
          }

        }      

      } else {

        filtered = tracks;

      }

      return filtered;
    }
  }

  angular.module('recApp.listen')
    .filter('trackDuration', trackDuration)
    .filter('trackDescription', trackDescription);

})();
