import * as angular from 'angular';

interface ICustomScope extends angular.IScope {
    title: string;
}

export class Page2Controller {
    static $inject = ['$scope'];
    constructor(private $scope: ICustomScope) {
        $scope.title = "Page2 Page";
    }
}
