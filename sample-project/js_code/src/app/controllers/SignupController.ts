import * as angular from 'angular';

interface ICustomScope extends angular.IScope {
    title: string;
    verified: boolean;
    email: string;
    password: string;
    confirmPassword: string;
    verifyEmail: any;
    submitPassword: any;
    toLoginPage: any;
}

export class SignupController {
    static $inject = ['$scope', '$location'];
    constructor(private $scope: ICustomScope, private $location: any) {
        $scope.title = "Sign Up Page";
        $scope.verified = false;
        $scope.email = '';
        $scope.password = '';
        $scope.confirmPassword = '';

        $scope.verifyEmail = function () {
            if ($scope.email !== '' && $scope.email.length > 6) {
                console.log($scope.email);
                $scope.verified = true;
            } else {
                $scope.verified = false;
            }
        }

        $scope.submitPassword = function () {
            console.log($scope.password, $scope.confirmPassword);
            if ($scope.password === $scope.confirmPassword && $scope.password.length > 5 && $scope.password !== '') {
                console.log('passwords match');
                $location.path('/login');
            }
        }

        $scope.toLoginPage = function() {
            $location.path('/login');
        }
    }
}
