(function() {
  'use strict';

  function recDBService($http) {

    function search(query) {
      var promise = $http({
        method: 'GET',
        url: 'http://dimd.webfactional.com/api/',
        params: { q: query },
        cache: true
      });

      return promise;
    } 
    
    return {
      search: search
    };

  }

  recDBService.$inject = ['$http'];

  angular.module('recDB')
    .factory('recDBService', recDBService);

})();
