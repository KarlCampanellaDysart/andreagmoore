angular.module('AndreaGMoore').controller("contactController", function($scope, Data) {
	Data.getContact(function (data) {
		$scope.contents = data;
	});

	$scope.isEmail = function (text) {
		return text.trim() === 'Email';
	}
	$scope.isFacebook = function (text) {
		return text.trim() === 'Facebook';
	}
	$scope.isLinkedIn = function (text) {
		return text.trim() === 'LinkedIn';
	}
	$scope.isPhoneNumber = function (text) {
		return text.trim() === 'Phone Number';
	}
	$scope.isTwitter = function (text) {
		return text.trim() === 'Twitter';
	}
	$scope.isIMDB = function (text) {
		return text.trim() === 'IMDB';
	}
});