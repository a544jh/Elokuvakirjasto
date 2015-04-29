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
                    description: 'Trying to find out where the term binary file came from'
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
                    // Etsitään muokattava viesti mockin taulukosti
                    movieToEdit = movie.find(function (m) {
                        return m.name = movie.name;
                    });
                    if (movieToEdit) {
                        // Muokataan viestiä
                        movieToEdit.name = movie.name;
                    }
                },
                removeMovie: function (movie) {
                    // Valitaan kaikki viestit, paitsi poistettava viesti
                    movie = movie.filter(function (m) {
                        m.name != movie.name
                    });
                },
                getObject: function (key, done) {
                    if (key == 'abc123') {
                        done({
                            name: 'Joku leffa',
                            director: 'Kalle Ilves',
                            release: 2015,
                            description: 'Mahtava leffa!'
                        });
                    } else {
                        done(null);
                    }
                }
            };
        })();

        RouteParamsMock = (function () {
            return {
                // Toteuta mockattu $routeParams-muuttuja tähän
                id: 'abc123'
            }
        });

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
       var movie = scope.m;
       debugger;
       expect(movie.name).toBe('Joku leffa');
    });

    /* 
     * Testaa, että käyttäjä pystyy muokkaamaan elokuvaa, jos tiedot ovat oikeat
     * Testaa myös, että Firebasea käyttävästä palvelusta kutsutaan oikeaa funktiota,
     * käyttämällä toBeCalled-oletusta.
     */
    it('should be able to edit a movie by its name, director, release date and description', function () {
        expect(true).toBe(false);
    });

    /*
     * Testaa, ettei käyttäjä pysty muokkaaman elokuvaa, jos tiedot eivät ole oikeat
     * Testaa myös, että Firebasea käyttävästä palvelusta ei kutsuta muokkaus-funktiota,
     * käyttämällä not.toBeCalled-oletusta.
     */
    it('should not be able to edit a movie if its name, director, release date or description is empty', function () {
        expect(true).toBe(false);
    });
});