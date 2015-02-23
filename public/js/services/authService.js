/*jslint white:true */
/*global location */
angular.module('madisonApp.services')
  .factory('AuthService', ['$http', 'SessionService', 'USER_ROLES',
    function ($http, SessionService, USER_ROLES) {
      var authService = {};

      authService.setUser = function (user) {
        SessionService.create(user);
      };

      authService.getUser = function () {
        var user = {};

        return $http.get('/api/user/current')
          .then(function (res) {
            var key;

            if (Object.getOwnPropertyNames(res.data).length > 0) {
              for (key in res.data.user) {
                if (res.data.user.hasOwnProperty(key)) {
                  user[key] = res.data.user[key];
                }
              }
            } else {
              user = null;
            }

            SessionService.create(user);
          });
      };

      authService.login = function (credentials) {
        return $http.post('/api/user/login', credentials)
                    .then(function () {
                      authService.getUser();
                    });
      };

      authService.isAuthenticated = function () {
        return !!SessionService.user;
      };

      authService.isAuthorized = function (authorizedRoles) {
        console.log(SessionService.user);

        if(!angular.isArray(authorizedRoles)) {
          authorizedRoles = [authorizedRoles];
        }

        //If everyone's allowed, or the user is an admin, return true
        if(authorizedRoles.indexOf(USER_ROLES.all) !== -1){
          return true;
        }
        
        return (authService.isAuthenticated() && authorizedRoles.indexOf(SessionService.user.role) !== -1);
      };

      authService.logout = function () {
        var logout = $http.get('/api/user/logout');

          SessionService.destroy();

          return logout;
      };

      authService.signup = function (credentials) {
        var signup = $http.post('/api/user/signup', credentials);

        return signup;
      };

      return authService;
    }]);