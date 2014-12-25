(function() {

  'use strict';

  function actualSrc($rootScope) {

    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        attrs.$observe('actualSrc', function(newVal, oldVal) {
          element.attr('src', 'assets/img/cover-na.gif');
          var img = new Image();
          img.src = attrs.actualSrc;
          angular.element(img).bind('load', function(event) {
            element.attr('src', attrs.actualSrc);
            
            // Progress bar color.
            if (element.parent().attr('id') === 'bigcover') {
              $rootScope.$broadcast('cover-loaded');
            }
          });
        });
      }
    };

  }

  actualSrc.$inject = ['$rootScope'];

  angular.module('recApp.discography')
    .directive('actualSrc', actualSrc);

})();
