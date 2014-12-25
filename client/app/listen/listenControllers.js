(function() {

  'use strict';

  function TracklistController($scope, playerService, tracklist) {

    var vm = this;

    vm.ytplayer = null;

    vm.playerOptions = {
      autoplay: 1,
      controls: 0
    };

    vm.ps = playerService;

    vm.ps.init(tracklist);


    $scope.$on('youtube.player.ready', function() {
      vm.ps.ytplayer = vm.ytplayer;
      vm.ps.showControls = true;
    });

  }
  
  angular.module('recApp.listen')
    .controller('TracklistController', TracklistController);

})();
