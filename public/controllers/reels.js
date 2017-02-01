angular.module('AndreaGMoore').controller("reelsController", function($scope, Data, ngAudio, $sce) {
	Data.getReels(function (data) {
		$scope.contents = data;
	});
});