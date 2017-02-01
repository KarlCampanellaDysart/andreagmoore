angular.module('AndreaGMoore').controller("resumeController", function($scope, Data, $sce) {
	Data.getResume(function (data) {
		$scope.contents = data;
	});
});