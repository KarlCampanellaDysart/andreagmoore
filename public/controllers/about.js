angular.module('AndreaGMoore').controller("aboutController", function($scope, Data) {
	Data.getAbout(function (data) {
		$scope.contents = data;
	});
});