(function() {

  'use strict';

  function controlsPanel() {

    function Controls(playerService) {

      var vm = this;

      vm.ps = playerService;

    }

    Controls.$inject = ['playerService'];

    return {
      controller: Controls,
      controllerAs: 'vm',
      replace: true,
      restrict: 'E', 
      scope: true,
      templateUrl: 'app/shared/controls/controls.html'
    };

  }

  function progressBar() {

    function link(scope, element, attrs) {
      element.bind('click', function(event) {
        var percentage = Math.floor(((event.pageX - element.offset().left) / element.width()) * 100);
        element.find('#progress-bar').css('width', (percentage) + '%');
        scope.vm.ps.ytplayer.seekTo(percentage * scope.vm.ps.ytplayer.getDuration() / 100);
      });

      scope.$watch('vm.ps.currentTime', function(newVal, oldVal) {
        if (scope.vm.ps.ytplayer) {
          var duration = scope.vm.ps.ytplayer.getDuration();
          element.find('#progress-bar').css('width', ((newVal/duration)) * 100 + '%');
        }
      });

      scope.$on('cover-loaded', function(event) {
        var img = $('#bigcover img');
        img.bind('load', function() {
          var colorThief = new ColorThief();
          var res = colorThief.getColor(img[0]);
          element.find('#progress-bar').css('background-color', 'rgb(' + res.join(',') + ')');
        });
      });
    }

    return {
      link: link,
      restrict: 'A',
      scope: true
    };
  }

  function volumeSpeaker() {
    function link (scope, element, attrs) {

      // Speaker icon click mute/unmute.
      element.bind('click', function() {
       scope.$apply(function() { scope.vm.ps.muted = !scope.vm.ps.muted; });
      });
      
      // Speaker icon mouse wheel.
      element.bind('mousewheel DOMMouseScroll', function(event){
        if (scope.vm.ps.ytplayer) {
          var currentVolume = scope.vm.ps.ytplayer.getVolume();

          if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
            if (scope.vm.ps.muted) {
              scope.$apply(function() { scope.vm.ps.muted = false; });
            }
            scope.vm.ps.ytplayer.setVolume((currentVolume > 95 ? 100 : currentVolume + 5));
          }
          else {
            if (currentVolume < 5) {
              scope.vm.ps.ytplayer.setVolume(0);
              scope.$apply(function() { scope.vm.ps.muted = true; });
            } else {
              scope.vm.ps.ytplayer.setVolume(currentVolume - 5);
            }
          }
          scope.vm.watchedVolume = scope.vm.ps.ytplayer.getVolume();
        }
        return false;
      });

      element.bind('mouseover', function() {
        scope.vm.speakerHovered = true;
      });

      element.bind('mouseout', function() {
        scope.vm.speakerHovered = false;
      });

      scope.$watch('vm.ps.muted', function(newVal, oldVal) {
        if (scope.vm.ps.ytplayer) {
          if (newVal) {
            scope.vm.ps.ytplayer.mute();
          } else {
            scope.vm.ps.ytplayer.unMute();
          }
        }
      });

    }

    return {
      link: link,
      restrict: 'A',
      scope: true
    };
  }

  function volumeBar() {
    function link(scope, element, attrs) {

      element.bind('click', function(event) {
        if (scope.vm.ps.ytplayer) {
          var percentage = Math.floor(((event.pageX - element.offset().left) / element.width()) * 100);
          element.find('#volume-bar').css('width', percentage + '%');
          scope.vm.ps.ytplayer.setVolume(percentage);
        }
      });

      scope.$watch('vm.ps.playing', function(newVal, oldVal) {
        if (newVal) {
          element.find('#volume-bar').css('width', scope.vm.ps.ytplayer.getVolume() + '%');
        }
      });

      scope.$watch('vm.watchedVolume', function(newVal, oldVal){
        element.find('#volume-bar').css('width', newVal + '%');
      });
    }

    return {
      link: link,
      restrict: 'A',
      scope: true
    };
  }

  angular.module('recApp.controls')
    .directive('controlsPanel', controlsPanel)
    .directive('progressBar', progressBar)
    .directive('volumeSpeaker', volumeSpeaker)
    .directive('volumeBar', volumeBar);

})();
