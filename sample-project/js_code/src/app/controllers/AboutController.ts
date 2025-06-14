import * as angular from 'angular';

interface ICustomScope extends angular.IScope {
    title: string;
}

export class AboutController {
    static $inject = ['$scope'];
    constructor(private $scope: ICustomScope) {
        $scope.title = "About Page";
    }
}
