(function() {

  'use strict';

  function tracklistItem() {

    function link(scope, element, attrs) {
      var track = scope.$eval(attrs.tracklistItem);

      element.click(function(event) {
        scope.$apply(function() { scope.vm.ps.playSelected(track); });
      });

      scope.$watch(function() { return scope.vm.ps.isActive(track); }, function(active) {
        if (active) {
          element.addClass('active-track');
        } else {
          element.removeClass('active-track');
        }
      });
    }

    return {
      restrict: 'A',
      scope: true,
      link: link 
    };
  }

  angular.module('recApp.listen')
    .directive('tracklistItem', tracklistItem);

})();
