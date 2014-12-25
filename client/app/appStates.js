(function() {

  'use strict';

  function Config($stateProvider, $stateParams) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'index.html'
      })

      // Start listen state.
      .state('listen', {
        onEnter: function($timeout, $stateParams, $rootScope) {
          $timeout(function() {
            $('html, body').animate({
              scrollTop: $("#player").offset().top
            }, 300);  
          }, 100);

          // Set page title.
          $rootScope.title = $stateParams.artistName + ' - ' + $stateParams.releaseName;
        },
        resolve: {
          playerService: 'playerService',
          tracklist: function(recDBService, $stateParams) {
            return recDBService.getTracks($stateParams.releaseGid);
          }
        },
        sticky: true,
        url: '/listen/:releaseGid/:artistName/:releaseName',
        views: {
          'listen': {
            controller: 'TracklistController as vm',
            templateUrl: 'app/listen/listenView.html',
          }
        }
      })
      // End listen state.

      // Start discography state.
      .state('discography', {
        onEnter: function($timeout, $stateParams, $rootScope) {
          $timeout(function() {
            $('html, body').animate({
              scrollTop: $("#discog").offset().top
            }, 400);  
          }, 100);

          // Set page title.
          $rootScope.title = $stateParams.artistName + ' Discography';

        },
        resolve: {
          recDBService: 'recDBService',
          releases: function(recDBService, $stateParams) {
            return recDBService.getDiscography($stateParams.artistGid);
          }
        },
        url: '/artist/:artistGid/:artistName',
        sticky: true,
        views: {
          'discography': {
            controller: 'DiscographyController as vm',
            templateUrl: 'app/discographies/discographyView.html',
          }
        }
      })
      .state('discography.albums', {
        data: {
          type: 'A'
        },
        controller: 'DiscographyController as vm',
        templateUrl: 'app/discographies/partials/release-partial.html',
        url: '/albums'
      })
      .state('discography.eps', {
        data: {
          type: 'EP'
        },
        controller: 'DiscographyController as vm',
        templateUrl: 'app/discographies/partials/release-partial.html',
        url: '/eps'
      })
      .state('discography.singles', {
        data: {
          type: 'S'
        },
        controller: 'DiscographyController as vm',
        templateUrl: 'app/discographies/partials/release-partial.html',
        url: '/singles'
      })
      .state('discography.osts', {
        data: {
          type: 'ST'
        },
        controller: 'DiscographyController as vm',
        templateUrl: 'app/discographies/partials/release-partial.html',
        url: '/osts'
      })
      .state('discography.compilations', {
        data: {
          type: 'C'
        },
        controller: 'DiscographyController as vm',
        templateUrl: 'app/discographies/partials/release-partial.html',
        url: '/compilations'
      });
      // End Discography state.

  }

  Config.$inject = ['$stateProvider'];

  angular.module('recApp').config(Config);
  
})();
