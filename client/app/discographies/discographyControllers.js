(function() {

  'use strict';

  function DiscographyController($filter, $scope, $state, recDBService, releases) {
    var vm = this;

    vm.artist = releases.data.results[0].artist;
    vm.getVerboseType = getVerboseType;
    vm.type = $state.current.data.type;
    vm.releases = getReleasesByType();    
    vm.hasReleases = hasReleases;

    function hasReleases() {
      return Object.keys(vm.releases).length !== 0; 
    }

    function getReleasesByType() {
      var orderedByDate = $filter('orderBy')(releases.data.results, 'year');
      return $filter('filter')(orderedByDate, {type: vm.type});
    }

    function getVerboseType() {
      switch (vm.type) {
        case 'A':
          return 'Albums';
        case 'EP':
          return 'EPs';
        case 'S':
          return 'Singles';
        case 'ST':
          return 'Soundtracks';
        case 'C':
          return 'Compilations';
      }
    }

  }

  angular.module('recApp.discography')
    .controller('DiscographyController', DiscographyController);

})();
