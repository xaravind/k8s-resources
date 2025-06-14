import * as angular from 'angular';

interface ICustomScope extends angular.IScope {
    title: string;
    login: any;
    email: string;
    password: string;
    rememberUser: boolean;
    data: any;
    toSignupPage: any;
        
}


export class LoginController {
    static $inject = ['$scope', 'AuthService','$location'];
    constructor(private $scope: ICustomScope, authService: any, $location: any) {
        $scope.title = "Login Page";
        $scope.email = '';
        $scope.password = '';
        $scope.rememberUser = false;
        

        $scope.login = function() {
            authService.login($scope.email, $scope.password)
                .then(function(data: any) {
                    // Handle successful login
                    console.log('Login successful', data);
                }, function(error: any) {
                    // Handle login error
                    console.error('Login failed', error);
                });
        };

        $scope.toSignupPage = function () {
            $location.path('/signup')
        }
    }
}
