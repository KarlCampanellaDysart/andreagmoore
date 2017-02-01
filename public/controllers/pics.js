angular.module('AndreaGMoore').controller("picsController", function($scope, Data) {
	Data.getHome(function (data) {		
		$scope.contents = data;
	});

	$scope.isBlank = function (str) {
		return str.trim() === '';
	}
});