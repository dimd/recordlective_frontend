(function() {
  'use strict';

  function recDBService($http) {
    
    var baseUrl = 'http://dimd.webfactional.com/api/';

    function search(query) {
      var promise = $http({
        method: 'GET',
        url: baseUrl,
        params: {q: query},
        cache: true
      });

      return promise;
    } 

    function getDiscography(artistGid) {
      var promise = $http({
        method: 'GET',
        url: baseUrl + 'artist/' + artistGid + '/',
        cache: true
      });

      return promise;
    }
    
    function getTracks(releaseGid) {
      var promise = $http({
        method: 'GET',
        url: baseUrl + 'release/' + releaseGid + '/',
        cache: true 
      });

      return promise;
    }
    
    return {
      search: search,
      getDiscography: getDiscography,
      getTracks: getTracks
    };

  }

  recDBService.$inject = ['$http'];

  angular.module('recDB')
    .factory('recDBService', recDBService);

})();
