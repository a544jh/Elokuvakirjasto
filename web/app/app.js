// Toteuta moduulisi tänne
var Elokuvakirjasto = angular.module('Elokuvakirjasto', ['ngRoute', 'firebase']);

Elokuvakirjasto.config(function ($routeProvider) {
    $routeProvider.when('/', {
        controller: 'ListController',
        templateUrl: 'app/views/list.html'
    })
            .when('/movies', {
                controller: 'ListController',
                templateUrl: 'app/views/list.html'
            })
            .when('/movies/new', {
                controller: 'NewMovieController',
                templateUrl: 'app/views/movie_form.html'
            })
            .when('/movies/:id', {
                controller: 'ShowMovieController',
                templateUrl: 'app/views/show.html'
            })
            .when('/movies/:id/edit', {
                controller: 'EditMovieController',
                templateUrl: 'app/views/movie_form.html'
            });
    // Lisää reitit tänne
});

Elokuvakirjasto.service('FirebaseService', function ($firebase) {
    // Keskustele Firebasen kanssa tämän palvelun avulla
    var firebaseRef = new Firebase('https://glaring-torch-4805.firebaseio.com/movies');
    var sync = $firebase(firebaseRef);
    var movies = sync.$asArray();

    this.addMovie = function (movie) {
        movies.$add(movie);
    };

    this.getMovies = function () {
        return movies;
    };

    this.getObject = function (key, done) {
        movies.$loaded(function () {
            done(movies.$getRecord(key));
        });
    };

    this.removeMovie = function (movie) {
        movies.$remove(movie);
    };

    this.editMovie = function (movie) {
        movies.$save(movie);
    };

});

Elokuvakirjasto.controller('ListController', function ($scope, FirebaseService) {
    $scope.movies = FirebaseService.getMovies();
});

Elokuvakirjasto.controller('NewMovieController', function ($scope, $location, FirebaseService) {
    $scope.action = "Add movie";

    $scope.formAction = function () {
        var movie = $scope.m;
        debugger;
        for (var f in movie) {
            if (movie[f] === '') {
                return;
            }
        }
        FirebaseService.addMovie(movie);
        $location.path('/movies');
    };
});

Elokuvakirjasto.controller('ShowMovieController', function ($scope, $routeParams, $location, FirebaseService) {
    FirebaseService.getObject($routeParams.id, function (data) {
        $scope.m = data;
    });

    $scope.removeMovie = function () {
        FirebaseService.removeMovie($scope.m);
        $location.path('/movies');
    };

    $scope.editMovie = function () {
        $location.path('/movies/' + $scope.m.$id + '/edit');
    };

});

Elokuvakirjasto.controller('EditMovieController', function ($scope, FirebaseService, $routeParams, $location) {
    FirebaseService.getObject($routeParams.id, function (data) {
        $scope.m = data;
    });

    $scope.action = "Edit movie";

    $scope.formAction = function () {
        FirebaseService.editMovie($scope.m);
        $location.path('/movies/' + $scope.m.$id);
    }

});
