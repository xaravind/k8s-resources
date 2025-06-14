import * as angular from 'angular';

interface ICustomScope extends angular.IScope {
    title: string;
}

export class Page3Controller {
    static $inject = ['$scope'];
    constructor(private $scope: ICustomScope) {
        $scope.title = "Page3 Page";
    }
}
