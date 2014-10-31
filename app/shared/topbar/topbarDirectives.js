(function() {
  'use strict';

  // Start recTopbar directive
  function recTopbar($window, $timeout) {

    function link(scope, element, attrs) {

      angular.element($window).on('scroll', function() {
        if (this.pageYOffset >= 65) {
          element.addClass('min').removeClass('max');
        }
        else {
          element.addClass('max').removeClass('min');
        }
      });
    }

    // Trigger event on page reload once.
    $timeout(function() {
      angular.element($window).trigger('scroll');
    }, 150);

    return {
      restrict: 'E',
      replace: true,
      link: link,
      templateUrl: 'app/shared/topbar/topbarView.html'  
    };

  }
  // End recTopbar directive

  angular
    .module('recApp.topbar')
    .directive('rectopbar', recTopbar);

})();
