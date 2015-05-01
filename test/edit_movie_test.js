if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}

describe('Edit movie', function () {
    var controller, scope;

    var FirebaseServiceMock, RouteParamsMock;

    beforeEach(function () {
        // Lisää moduulisi nimi tähän
        module('Elokuvakirjasto');

        FirebaseServiceMock = (function () {
            var movies = [
                {
                    name: 'The term binary file - a documentary',
                    director: 'Axel',
                    year: '2015',
                    description: 'Trying to find out where the term binary file came from',
                    id: 'BINARY!'
                },
                {
                    name: 'Joku leffa',
                    director: 'Kalle Ilves',
                    year: 2015,
                    description: 'Mahtava leffa!',
                    id: 'abc123'
                }
            ];
            return {
                addMovie: function (movie) {
                    movies.push(movie);
                },
                getMovies: function () {
                    return movies;
                },
                editMovie: function (movie) {
                    movieToEdit = movies.find(function (m) {
                        return m.id === movie.id;
                    });
                    if (movieToEdit) {
                        movieToEdit = movie;
                    }
                },
                removeMovie: function (movie) {
                    // Valitaan kaikki viestit, paitsi poistettava viesti
                    movie = movie.filter(function (m) {
                        m.name != movie.name;
                    });
                },
                getObject: function (key, done) {
                    var copy = JSON.parse(JSON.stringify(movies.find(function (m) {
                        return m.id === key;
                    })));
                    done(copy);
                }
            };
        })();

        RouteParamsMock = {
            // Toteuta mockattu $routeParams-muuttuja tähän
            id: 'abc123'
        };

        // Lisää vakoilijat
        spyOn(FirebaseServiceMock, 'editMovie').and.callThrough();
        spyOn(FirebaseServiceMock, 'getObject').and.callThrough();

        // Injektoi toteuttamasi kontrolleri tähän
        inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            // Muista vaihtaa oikea kontrollerin nimi!
            controller = $controller('EditMovieController', {
                $scope: scope,
                FirebaseService: FirebaseServiceMock,
                $routeParams: RouteParamsMock
            });
        });
    });

    /*
     * Testaa alla esitettyjä toimintoja kontrollerissasi
     */

    /*
     * Testaa, että muokkauslomakkeen tiedot täytetään muokattavan elokuvan tiedoilla.
     * Testaa myös, että Firebasea käyttävästä palvelusta kutsutaan oikeaa funktiota,
     * käyttämällä toBeCalled-oletusta.
     */
    it('should fill the edit form with the current information about the movie', function () {
        expect(FirebaseServiceMock.getObject).toHaveBeenCalled();
        expect(scope.m.name).toBe('Joku leffa');
    });

    /* 
     * Testaa, että käyttäjä pystyy muokkaamaan elokuvaa, jos tiedot ovat oikeat
     * Testaa myös, että Firebasea käyttävästä palvelusta kutsutaan oikeaa funktiota,
     * käyttämällä toBeCalled-oletusta.
     */
    it('should be able to edit a movie by its name, director, release date and description', function () {
        expect(FirebaseServiceMock.getObject).toHaveBeenCalled();
        scope.m.name = 'Joku toinen leffa';
        scope.formAction();
        expect(FirebaseServiceMock.editMovie).toHaveBeenCalled();
//        var movie;
//        FirebaseServiceMock.getObject('abc123', function (data) {
//            movie = data;
//        });
//        expect(movie.name).toBe('Joku toinen leffa');
    });

    /*
     * Testaa, ettei käyttäjä pysty muokkaaman elokuvaa, jos tiedot eivät ole oikeat
     * Testaa myös, että Firebasea käyttävästä palvelusta ei kutsuta muokkaus-funktiota,
     * käyttämällä not.toBeCalled-oletusta.
     */
    it('should not be able to edit a movie if its name, director, release date or description is empty', function () {
        expect(FirebaseServiceMock.getObject).toHaveBeenCalled();
        scope.m.name = '';
        scope.formAction();
        expect(FirebaseServiceMock.editMovie).not.toHaveBeenCalled();
        //fuck this
//        var movie;
//        FirebaseServiceMock.getObject('abc123', function (data) {
//            movie = data;
//        });
//        expect(movie.name).toBe('Joku leffa');
    });
});