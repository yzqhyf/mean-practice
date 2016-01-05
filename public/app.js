var app = angular.module('flapperNews', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl'
		})
		.state('posts', {
			url: '/posts/{id}',
			templateUrl: '/posts.html',
			controller: 'PostsCtrl'
		});

	$urlRouterProvider.otherwise('home');
}]);

app.controller('MainCtrl', ['$scope', 'posts', function($scope, posts) {
	
	$scope.posts = [{title: 'post 1', upvotes: 5},
	                {title: 'post 2', upvotes: 2},
	                {title: 'post 3', upvotes: 6},
	                {title: 'post 4', upvotes: 7},
	                {title: 'post 5', upvotes:10},
	                {title: 'post 6', upvotes: 4}
	                ];
	$scope.posts = posts.posts;
	$scope.addPost = function() {
		if(!$scope.title || $scope.title === '') {return;}
		$scope.posts.push({
			title: $scope.title, 
			link: $scope.link, 
			upvotes: 0,
			comments: []
		});
		$scope.title = '';
		$scope.link = '';
		$scope.comments = [];
	};

	$scope.incrementsUpvotes = function(post) {
		post.upvotes += 1;
	};
}]);

app.factory('posts', [function() {
	var service = {
		posts: []
	};
	return service;
}]);

app.controller('PostsCtrl',['$scope', '$stateParams', 'posts', function($scope, $stateParams, posts){
	$scope.post = posts.posts[$stateParams.id];
	$scope.addComment = function() {
		if($scope.body === '') {return;}
		$scope.post.comments.push({
			body: $scope.body,
			author: 'user',
			upvotes: 0
		});
		$scope.body = '';
	};
}]);

