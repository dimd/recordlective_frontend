(function() {

  'use strict';

  function timeFilter() {
    return function(seconds) {
      var minutes = Math.floor(seconds / 60),
          seconds = Math.floor(seconds % 60);
      return minutes + ':' + (seconds < 10 ? '0' + seconds : seconds);
    };
  }

  angular.module('recApp.controls')
    .filter('time', timeFilter);

})();
