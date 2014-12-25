(function() {

  'use strict';

  function youtubeAPIService($http) {

    var APIKEY = 'AIzaSyDLZ90ERRRvmyQ9niCNL9SZ2GNy3kFtErI',
        searchUrl = 'https://www.googleapis.com/youtube/v3/search',
        videoUrl = 'https://www.googleapis.com/youtube/v3/videos';

    function getSeconds(duration) {
      var timeRe = new RegExp('PT((\\d+)M){0,1}((\\d+)S){0,1}');

      var arr = timeRe.exec(duration);
      return (parseInt(arr[2], 10) * 60 || 0) + (parseInt(arr[4], 10) || 0);
    }

    function appendTransform(defaults, transform) {
      defaults = angular.isArray(defaults) ? defaults : [defaults];
      return defaults.concat(transform);
    }

    function doVideoTransform (value) {
      var videos = [];

      value.items.forEach(function(value) {
        videos.push({
          id: value.id,
          duration: getSeconds(value.contentDetails.duration),
          title: value.snippet.title,
          descritpion: value.snippet.description
        });
      });

      return videos;
    }

    function doSearchTransform(value) {
      var videos = [];

      value.items.forEach(function(value) {
        videos.push({ id: value.id.videoId });   
      });

      return videos;
    }

    function joinIds(prevVal, next) {
      return next.id + ',' + prevVal;
    }

    function search(term) {
      var promise = $http({
        method: 'GET',
        url: searchUrl,
        params: {
          part: 'id',
          maxResults: '20',
          order: 'relevance',
          q: term,
          type: 'video',
          videoEmbeddable: 'true',
          fields: 'items/id',
          key: APIKEY 
        },
        cache: true,
        transformResponse: appendTransform($http.defaults.transformResponse, doSearchTransform)
      });
      
      return promise;

    }

    function video(videoIds) {
      var promise = $http({
        method: 'GET',
        url: videoUrl,
        params: {
          part: 'id,snippet,contentDetails',
          id: videoIds.reduce(joinIds, ''),
          fields: 'items(id,contentDetails,snippet)',
          key: APIKEY 
        },
        cache: true,
        transformResponse: appendTransform($http.defaults.transformResponse, doVideoTransform)
      });
      
      return promise;

    }

    return {
      search: search,
      video: video 
    };

  }

  youtubeAPIService.$inject = ['$http'];
 
  angular.module('youtubeAPI')
    .factory('youtubeAPIService', youtubeAPIService);

})();
