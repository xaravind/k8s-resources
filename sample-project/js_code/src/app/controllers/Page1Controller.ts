import * as angular from 'angular';

interface ICustomScope extends angular.IScope {
    title: string;
}

export class Page1Controller {
    static $inject = ['$scope'];
    constructor(private $scope: ICustomScope) {
        $scope.title = "Page1 Page";
    }
}
