(function() {

  'use strict';

  // Start login directive.

  function login($window, $auth) {

    // Directive controller.

    function LoginController($auth) {
      var vm = this;

      vm.authenticate = authenticate;
      vm.isAuthenticated = isAuthenticated;
      vm.logout = logout;

      function authenticate(provider) {
        $auth.authenticate(provider);
      }

      function isAuthenticated() {
        return $auth.isAuthenticated();
      }

      function logout() {
        $auth.removeToken();
      }

    }
    
    function link(scope, element, attrs) {
      element.bind('click', function() {
        element.find('#menu.menu-container').slideToggle('fast');
      });

    }

    return {
      controller: LoginController,
      controllerAs: 'vm',
      link: link,
      restrict: 'E',
      scope: true,
      templateUrl: 'app/shared/login/login.html'
    };
  }

  login.$inject = ['$window', '$auth'];

  // End login directive.

  angular.module('recApp.login')
    .directive('login', login);

})();
