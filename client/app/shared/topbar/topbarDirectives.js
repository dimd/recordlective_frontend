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
  
  // Start autocomplete directive.

  function autocomplete() {

    function AutocompleteController($state, recDBService) {
      var vm = this;

      vm.active = -1;
      vm.activate = activate;
      vm.activateNext = activateNext;
      vm.activatePrevious = activatePrevious;
      vm.query = '';
      vm.getListSize = getListSize;
      vm.inputFocused = false;
      vm.isActive = isActive;
      vm.isListVisible = isListVisible;
      vm.hasArtists = hasArtists;
      vm.hasReleases = hasReleases;
      vm.mousedOver = false;
      vm.results = null;
      vm.search = search;
      vm.select = select;
      vm.selectActive = selectActive;

      function search() {

        if (vm.query.length > 2) {
          recDBService.search(vm.query).success(function(data) {
            vm.results = data;
            vm.combinedList = [];
            
            for (var i in vm.results) {
              if (!vm.results.hasOwnProperty(i)) continue;

              vm.results[i].forEach(function(result) {
                vm.combinedList.push(result);
              });
            }
          });
        } else {
          vm.results = null;
        }
      }

      function getListSize() {
        if (vm.isListVisible()) {
          return vm.results.artists.length + vm.results.releases.length;
        } else {
          return 0;
        }
      }

      function isListVisible() {
        return vm.hasArtists() || vm.hasReleases();
      }

      function hasArtists() {
        if (vm.results) 
          return vm.results.artists.length;
        return false;
      }

      function hasReleases() {
        if (vm.results)
          return vm.results.releases.length;
        return false;
      }

      function activate(item) {
        vm.active = item;
      }

      function isActive(item) {
        return vm.active == item;
      }

      function activateNext() {
        vm.activate(vm.combinedList[(vm.combinedList.indexOf(vm.active) + 1) % vm.combinedList.length]);
      }

      function activatePrevious() {
        if (vm.combinedList.indexOf(vm.active) - 1 < 0) {
          vm.activate(vm.combinedList[vm.combinedList.length-1]);
        } else {
          vm.activate(vm.combinedList[(vm.combinedList.indexOf(vm.active) - 1) % vm.combinedList.length]);
        }
      }

      function select(item) {
        if (item.type === 'artist') {
          $state.go('discography.albums', {artistGid: item.gid, artistName: item.name});
        } else {
          $state.go('listen', {releaseGid: item.release_gid, artistName: item.artist_credit_name , releaseName: item.name});          
        }
        vm.results = null;
        vm.query = '';
      }

      function selectActive() {
        vm.select(vm.active);
      }

    }

    AutocompleteController.$inject = ['$state', 'recDBService'];

    function link(scope, element, attrs) {
      element.find('input').bind('keydown', function(event) {
        // Down arrow.
        if (event.keyCode == '40') {
          scope.$apply(function(){ scope.vm.activateNext(); });
          return false;
        }

        // Up arrow.
        if (event.keyCode == '38') {
          scope.$apply(function() { scope.vm.activatePrevious(); });
          return false;
        }
      });

      element.find('input').bind('keyup', function(event) {
        // Esc.
        if (event.keyCode == '27') {
          scope.$apply(function(){ 
            scope.vm.results = null; 
            scope.vm.query = '';
          });
        }

        //Enter or tab.
        if (event.keyCode == '13' || event.keyCod == '9') {
          scope.$apply(function(){ scope.vm.selectActive(); });
        }
      });

      element.find('input').bind('blur', function(event) {
        scope.$apply(function() { scope.vm.inputFocused = false; });
      });

      element.find('input').bind('focus', function(event) {
        scope.$apply(function() { scope.vm.inputFocused = true; });
      });

      element.find('.autocomplete-list').bind('mouseover', function(event) {
        scope.$apply(function() { scope.vm.mousedOver = true; });
      });

      element.find('.autocomplete-list').bind('mouseleave', function(event) {
        scope.$apply(function() { scope.vm.mousedOver = false; });
      });

      scope.$watch('vm.inputFocused', function(focused) {
        if (!focused && !scope.vm.mousedOver) {
          element.find('.autocomplete-list').css({'display': 'none'});
        } else {
          element.find('.autocomplete-list').css({'display': 'block'});
        }
      });
    }

    return {
      controller: AutocompleteController,
      controllerAs: 'vm',
      link: link,
      replace: true,
      restrict: 'E',
      transclude: true,
      templateUrl: 'app/shared/topbar/autocomplete.html'
    };

  }

  // End autocomplete directive.
  
  // Start autocomplete item.
  
  function autocompleteItem() {
    function link(scope, element, attrs, controller) {
      var item = scope.$eval(attrs.autocompleteItem);

      item.type = attrs.autocompleteItem;
          
      scope.$watch(function() { return controller.isActive(item); }, function(active) {
        if (active) {
          element.addClass('active');
        } else {
          element.removeClass('active');
        }
      });

      element.bind('mouseenter', function(e) {
        scope.$apply(function() { controller.activate(item); });
      });

      element.bind('click', function(e) {
        scope.$apply(function() { controller.select(item); });
      });
    }

    return {
      link: link,
      require: '^autocomplete',
      restrict: 'A'
    };
  }

  // End autocomplete item.
  

  angular
    .module('recApp.topbar')
    .directive('rectopbar', recTopbar)
    .directive('autocomplete', autocomplete)
    .directive('autocompleteItem', autocompleteItem);

})();
