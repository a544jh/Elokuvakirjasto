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
            .when('/movies/search', {
                controller: 'SearchController',
                templateUrl: 'app/views/search.html'})
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

Elokuvakirjasto.config(['$httpProvider', function ($httpProvider) {
        delete $httpProvider.defaults.headers.common["X-Requested-With"];
    }]);

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

Elokuvakirjasto.service('APIService', function ($http) {
    this.findMovie = function (name, year) {
        return $http.get('http://www.omdbapi.com', {params: {s: name, y: year}});
    };
});

isValid = function (movie) {
    for (var f in movie) {
        if (movie[f] === '') {
            return false;
        }
    }
    return true;
};

Elokuvakirjasto.controller('ListController', function ($scope, FirebaseService) {
    $scope.movies = FirebaseService.getMovies();
});

Elokuvakirjasto.controller('NewMovieController', function ($scope, $location, FirebaseService) {
    $scope.action = "Add movie";

    $scope.formAction = function () {
        var movie = $scope.m;
        if (!isValid(movie)) {
            return;
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
    $scope.m = {};
    FirebaseService.getObject($routeParams.id, function (data) {
        $scope.m = data;
    });

    $scope.action = "Edit movie";
    $scope.formAction = function () {
        var movie = $scope.m;
        if (!isValid(movie)) {
            return;
        }
        FirebaseService.editMovie($scope.m);
        $location.path('/movies/' + $scope.m.$id);
    };

});

Elokuvakirjasto.controller('SearchController', function ($scope, APIService) {
    $scope.search = function () {
        APIService.findMovie($scope.name, $scope.year).success(function (movies) {
            $scope.movies = movies.Search;
            if (!$scope.movies) {
                $scope.message = 'No movies found.';
            } else if ($scope.movies.length === 1){
                $scope.message = '1 movie found';
            } else {
                $scope.message = $scope.movies.length + ' movies found';
            }
        });  
    };
});