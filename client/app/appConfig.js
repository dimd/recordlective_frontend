(function() {

  'use strict';

  function config($authProvider) {
    $authProvider.facebook({
        clientId: '320630331465165'
    });

    $authProvider.google({
      clientId: '668345960240.apps.googleusercontent.com'
    });

    $authProvider.twitter({
      url: 'auth/twitter'
    });
  }

  angular.module('recApp')
    .config(config);

})();
