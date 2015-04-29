// Toteuta moduulisi tänne
var Elokuvakirjasto = angular.module('Elokuvakirjasto', ['ngRoute', 'firebase']);

Elokuvakirjasto.config(function ($routeProvider) {
    $routeProvider.when('/', {
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

});

Elokuvakirjasto.controller('ListController', function ($scope, FirebaseService) {
    $scope.movies = FirebaseService.getMovies();
});

Elokuvakirjasto.controller('NewMovieController', function ($scope, $location, FirebaseService) {
    $scope.addMovie = function () {
        var movie = {
            name: $scope.name,
            director: $scope.director,
            year: $scope.year,
            description: $scope.description
        };
        for (var f in movie) {
            console.log(movie[f]);
            if (movie[f] === '') {
                return;
            }
        }
        FirebaseService.addMovie(movie);
        $location.path('/');
    };
});

Elokuvakirjasto.controller('ShowMovieController', function ($scope, $routeParams, FirebaseService) {
    FirebaseService.getObject($routeParams.id, function (data) {
        $scope.m = data;
    });
});
