var app = angular.module('flapperNews', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl',
			resolve: {
				postPromise: ['posts', function(posts) {
					return posts.getAll();
				}]
			}
		})
		.state('posts', {
			url: '/posts/{id}',
			templateUrl: '/posts.html',
			controller: 'PostsCtrl',
			resolve: {
				post: ['$stateParams', 'posts', function($stateParams, posts) {
					return posts.get($stateParams.id);
				}]
			}
		});

	$urlRouterProvider.otherwise('home');
}]);

app.controller('MainCtrl', ['$scope', 'posts', function($scope, posts) {
	$scope.posts = posts.posts;
	$scope.addPost = function() {
		if(!$scope.title || $scope.title === '') {return;}
		posts.create({
			title: $scope.title, 
			link: $scope.link,
		});
		$scope.title = '';
		$scope.link = '';
	};

	$scope.incrementsUpvotes = function(post) {
		posts.upvote(post);
	};
}]);

app.factory('posts', ['$http', function($http) {
	var service = {
		posts: []
	};
	service.getAll = function() {
		return $http.get('/posts').success(function(data) {
			angular.copy(data, service.posts);
		});
	};
	service.create = function(posts) {
		return $http.post('/posts', posts).success(function(data) {
			service.posts.push(data);
		});
	};
	service.upvote = function(posts) {
		console.log(posts);
		return $http.put('/posts/' + posts._id + '/upvote')
		.success(function(data) {
			posts.upvotes +=1;
		});
	};
	service.get = function(id) {
		return $http.get('/posts/' + id).then(function(res) {
			return res.data;
		});
	};
	service.addComment = function(id, comment) {
		return $http.post('/posts/' + id + '/comments', comment);
	};
	service.upvoteComment = function(posts, comment) {
		console.log("posts Id " + posts._id +  "comment._id :" + comment._id);
		return $http.put('/posts/' + posts._id + '/comments/' + comment._id +'/upvote')
		.success(function(data) {
			comment.upvotes += 1;
		}).error(function(err) {
			console.log(err);
		});
	};

	return service;
}]);

app.controller('PostsCtrl',['$scope', 'posts', 'post', function($scope, posts, post){
	$scope.post = post;
	$scope.addComment = function() {
		if($scope.body === '') {
			return;
		}
		posts.addComment(post._id, {
			body: $scope.body,
			author: 'user',
		}).success(function(comment) {
			$scope.post.comments.push(comment);
		});
		$scope.body = '';
	};

	$scope.incrementsUpvotes = function(comment) {
		posts.upvoteComment(post, comment);
	}
}]);

