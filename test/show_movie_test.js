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

describe('Show movie', function () {
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
                    movieToRemove = movies.find(function (m) {
                        return m.id === movie.id;
                    });
                    movies.splice(movies.indexOf(movieToRemove),1);
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
        spyOn(FirebaseServiceMock, 'getObject').and.callThrough();
        spyOn(FirebaseServiceMock, 'removeMovie').and.callThrough();

        // Injektoi toteuttamasi kontrolleri tähän
        inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            // Muista vaihtaa oikea kontrollerin nimi!
            controller = $controller('ShowMovieController', {
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
     * Testaa, että Firebasesta (mockilta) saatu elokuva löytyy kontrollerista.
     * Testaa myös, että Firebasea käyttävästä palvelusta kutsutaan oikeaa funktiota
     * käyttämällä toBeCalled-oletusta.
     */
    it('should show current movie from Firebase', function () {
        expect(FirebaseServiceMock.getObject).toHaveBeenCalled();
        expect(scope.m.name).toBe('Joku leffa');
    });

    /* 
     * Testaa, että elokuvan pystyy poistamaan Firebasesta.
     * Testaa myös, että Firebasea käyttävästä palvelusta kutsutaan oikeaa funktiota,
     * käyttämällä toBeCalled-oletusta.
     */
    it('should be able to remove a movie', function () {
        scope.removeMovie();
        expect(FirebaseServiceMock.removeMovie).toHaveBeenCalled();
        expect(FirebaseServiceMock.getMovies().length).toBe(1);
    });
});