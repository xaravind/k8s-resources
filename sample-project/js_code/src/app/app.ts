import * as angular from 'angular';
import 'angular-route';
import 'angular-animate';
import 'angular-aria';
import 'angular-material';
import '../assets/css/app.css';

import { HomeController } from './controllers/HomeController';
import { AboutController } from './controllers/AboutController';
import { Page1Controller } from './controllers/Page1Controller';
import { Page2Controller } from './controllers/Page2Controller';
import { Page3Controller } from './controllers/Page3Controller';
import { LoginController } from './controllers/LoginController';
import { SignupController } from './controllers/SignupController';


const app = angular.module('myApp', ['ngMaterial','ngRoute','ngAnimate']);

app.controller('MainCtrl', function($scope: any, $mdSidenav, $location, $log, $timeout, $mdDialog, $rootScope, $mdMenu, $document, $window, $mdMedia, AuthService, LoadingService) {
  $scope.myInitFunction = function() {
    // Initialization code here
    if ($scope.currentTheme === 'light') {
        $document.find('body').addClass('body-light');
        $document.find('body').removeClass('body-dark');
    } else if ($scope.currentTheme === 'dark') {
        $document.find('body').addClass('body-dark');
        $document.find('body').removeClass('body-light');
    } else {
        $document.find('body').addClass('body-light');
    }
    console.log('Controller initialized');

  };

  var body = angular.element(document.body);
  $scope.isDialogOpen = false;  
  $scope.currentPath = $location.path();

  $scope.$watch(function() {
     return $location.path();
  }, function(newPath: string) {
    $scope.currentPath = newPath;
  });

  $scope.shouldHideSidenav = function() {
    return $scope.currentPath === '/login' || $scope.currentPath === '/signup';
  };

  $scope.shouldLockOpen = function() {
    var path = $location.path();
    return $mdMedia('gt-sm') && path !== '/login' && path !== '/signup';
  };
  $scope.toggleLeft = buildDelayedToggler('left');
  $scope.navigateTo = function(path: string) {
    $scope.toggleLeft('left');
    $location.path(path);
    $scope.currentPath = path
  };
  

    
  $scope.currentTheme = JSON.parse(localStorage.getItem('theme')) === null ? 'light' :JSON.parse(localStorage.getItem('theme')); 
  $scope.toggleTheme = function() {
    console.log('theme switched')
    $scope.currentTheme = $scope.currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', JSON.stringify($scope.currentTheme));

    if ($scope.currentTheme === 'light') {
        $document.find('body').addClass('body-light');
        $document.find('body').removeClass('body-dark');
    } else if ($scope.currentTheme === 'dark') {
        $document.find('body').addClass('body-dark');
        $document.find('body').removeClass('body-light');
    } else {
        $document.find('body').addClass('body-light');
    }
    $rootScope.$emit('currentTheme', $scope.currentTheme);
  };

  $scope.openUserMenu = function($mdMenu: any, ev: any) {
        $mdMenu.open(ev);
        $document.find('body').addClass('menu-active');
        $document.find('md-toolbar').addClass('toolbar-overflow');
  };
  $scope.items = ['item1','item2', 'item3', 'item4', 'item5', 'item6', 'item7'];
  $scope.openClientMenu = function($mdMenu: any, ev: any) {
        $mdMenu.open(ev);
        $document.find('body').addClass('menu-active');
        $document.find('md-toolbar').addClass('toolbar-overflow');
  };

  $scope.$on('$mdMenuClose', function() {
    $document.find('body').removeClass('menu-active');
    $document.find('md-toolbar').removeClass('toolbar-overflow');
  })

  angular.element($window).on('resize', function() {
    if ($window.innerWidth > 960) {
      body.css('overflow', '');
    } else if ($mdSidenav('left').isOpen() && $window.innerWidth < 960) {
      body.css('overflow', 'hidden');
    }
  });

   $scope.$watch(function() {
        return $mdSidenav('left').isOpen();
    }, function(isOpen: any) {
        if (isOpen && $window.innerWidth < 960) {
            body.css('overflow', 'hidden');
        } else {
            body.css('overflow', '');
        }
    });

  $scope.$on('$destroy', function() {
    angular.element($window).off('resize');
  });

  $scope.$watch('isDialogOpen', function(newValue: boolean) {
    console.log(newValue);
    if (newValue === true) {
        body.css('overflow', 'auto');
    } else {
        body.css('overflow', '');
    }
  });


  function debounce(func: (...args: any[]) => void, wait: number, context?: any) {
    let timer: number | undefined;

    return function (...args: any[]) {
        $timeout.cancel(timer);
        timer = $timeout(() => {
            func.apply(context || this, args);
        }, wait);
    };
   }


    function buildDelayedToggler(navID: string) {
        return debounce(function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
            .toggle()
            .then(function () {
              
              $log.debug("toggle " + navID + " is done");
            });
        }, 200);
    }


    function updateBodyScroll(navID: string) {
      if ($mdSidenav(navID).isOpen() && $window.innerWidth < 960) {
          body.css('overflow', 'hidden');
      } else {
          body.css('overflow', '');
      }
  }


  function buildToggler(navID: string) {
    return function() {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav(navID)
        .toggle()
        .then(function () {
          $log.debug("toggle " + navID + " is done");
        });
    };
  }

  var originatorEv : any;

    $scope.openMenu = function($mdMenu: any, ev: Event) {
      originatorEv = ev;
      $mdMenu.open(ev);
      $document.find('body').addClass('menu-active');
      $document.find('md-toolbar').addClass('toolbar-overflow');
    };

    $scope.logout = function() {
      console.log('logout clicked');
      AuthService.logout();
    };
    
    this.notificationsEnabled = true;
    this.toggleNotifications = function() {
      this.notificationsEnabled = !this.notificationsEnabled;
    };
    
    this.redial = function() {
      $scope.isDialogOpen = true;
      $mdDialog.show(
        $mdDialog.alert()
          .targetEvent(originatorEv)
          .clickOutsideToClose(true)
          .parent('body')
          .theme($scope.currentTheme)
          .title('Suddenly, a redial')
          .textContent('You just called a friend; who told you the most amazing story. Have a cookie!')
          .ok('That was easy')
      ).finally(function() {
        $scope.isDialogOpen = false; // Set to false when the dialog is closed
      });

      originatorEv = null;
    };

    this.checkVoicemail = function() {
      // This never happens.
    };
    
});



// Configure routes
app.config(['$routeProvider', ($routeProvider: angular.route.IRouteProvider) => {
    $routeProvider
        .when('/', {
            template: require('./views/home.html'),
            controller: HomeController,
            controllerAs: 'vm',
            resolve: {
              auth: function(AuthService: any, $location: any) {
                  return AuthService.isLoggedIn()
                      .then(function(isLoggedIn: any) {
                          if (!isLoggedIn) {
                              $location.path('/login');
                          }
                      });
              }
          }
        })
        .when('/page1', {
            template: require('./views/page1.html'),
            controller: Page1Controller,
            controllerAs: 'vm',
            resolve: {
              auth: function(AuthService: any, $location: any) {
                  return AuthService.isLoggedIn()
                      .then(function(isLoggedIn: any) {
                          if (!isLoggedIn) {
                              $location.path('/login');
                          }
                      });
              }
          }
        })
        .when('/page2', {
            template: require('./views/page2.html'),
            controller: Page2Controller,
            controllerAs: 'vm',
            resolve: {
              auth: function(AuthService: any, $location: any) {
                  return AuthService.isLoggedIn()
                      .then(function(isLoggedIn: any) {
                          if (!isLoggedIn) {
                              $location.path('/login');
                          }
                      });
              }
          }
        })
        .when('/page3', {
            template: require('./views/page3.html'),
            controller: Page3Controller,
            controllerAs: 'vm',
            resolve: {
              auth: function(AuthService: any, $location: any) {
                  return AuthService.isLoggedIn()
                      .then(function(isLoggedIn: any) {
                          if (!isLoggedIn) {
                              $location.path('/login');
                          }
                      });
              }
          }
        })
        .when('/about', {
            template: require('./views/about.html'),
            controller: AboutController,
            controllerAs: 'vm',
            resolve: {
              auth: function(AuthService: any, $location: any) {
                  return AuthService.isLoggedIn()
                      .then(function(isLoggedIn: any) {
                          if (!isLoggedIn) {
                              $location.path('/login');
                          }
                      });
              }
          }
        })
        .when('/login', {
            template: require('./views/login.html'),
            controller: LoginController,
            controllerAs: 'vm'
        })
        .when('/signup', {
            template: require('./views/signup.html'),
            controller: SignupController,
            controllerAs: 'vm'
        })
        .otherwise({ redirectTo: '/' });

}]);

//Configure themes
app.config(['$mdThemingProvider', function($mdThemingProvider: angular.material.IThemingProvider) {
    // Define the light theme
    $mdThemingProvider.theme('light')
        .primaryPalette('indigo')
        .accentPalette('pink');
        
        

    // Define the dark theme
    $mdThemingProvider.theme('dark')
        .primaryPalette('blue-grey')
        .accentPalette('amber')
        .dark();
    
}]);

app.service('LoadingService', function($rootScope: any) {
  var service = {
      isLoading: false,
      show: function() {
          this.isLoading = true;
          $rootScope.$broadcast('loading:show');
      },
      hide: function() {
          this.isLoading = false;
          $rootScope.$broadcast('loading:hide');
      }
  };
  return service;
});

app.service('AuthService', function($http: angular.IHttpService , $q: any, $location: any) {
  var service: any = {};
  
  service.isLoggedIn = function () {
    var deferred = $q.defer();
    var loggedIn = !!JSON.parse(localStorage.getItem('loggedIn'));
    deferred.resolve(loggedIn);
    return deferred.promise;
  }
  
  service.logout = function () {
   
    localStorage.removeItem('loggedIn');
    $location.path('/login');
  }

  service.login = function(username: string, password: string) {
      var deferred = $q.defer();

      // Replace this with actual server communication logic
      // $http.post('/api/login', { username: username, password: password })
      //     .then(function(response: any) {
      //         if (response.data.success) {
      //             deferred.resolve(response.data);
      //         } else {
      //             deferred.reject('Invalid credentials');
      //         }
      //     }, function(error: any) {
      //         deferred.reject('Error during login');
      //     });


        if (username.toLowerCase() === 'johannroll@gmail.com' && password === 'JoQwert123') {
            localStorage.setItem('loggedIn', JSON.stringify(true));
            deferred.resolve('User details authenticated');
            $location.path('/');
        } else {
            deferred.reject('Invalid credentials');
        }

      return deferred.promise;
  };


  return service;
});

app.factory('httpInterceptor', function($q: any, LoadingService: any) {
  return {
      request: function(config: any) {
          LoadingService.show();
          return config;
      },
      response: function(response: any) {
          LoadingService.hide();
          return response;
      },
      responseError: function(response: any) {
          LoadingService.hide();
          return $q.reject(response);
      }
  };
});

app.config(function($httpProvider: any) {
  $httpProvider.interceptors.push('httpInterceptor');
});


app.run(function($rootScope: any, $location: any, AuthService: any) {
  $rootScope.$on('$routeChangeStart', function(event: any, next: any, current: any) {
      if (next.protected && !AuthService.isLoggedIn()) {
          // Prevent navigating to the route
          event.preventDefault();
          $location.path('/login');
      }
  });
  $rootScope.$on('loading:show', function() {
    $rootScope.showLoader = true;
  });

  $rootScope.$on('loading:hide', function() {
    $rootScope.showLoader = false;
  });
});










