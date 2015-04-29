describe('Add movie', function(){
	var controller, scope;

	var FirebaseServiceMock;

  	beforeEach(function(){
  		// Lisää moduulisi nimi tähän
    	module('Elokuvakirjasto');

    	FirebaseServiceMock = (function(){
            var movies = [
                {
                    name: 'The term binary file - a documentary',
                    director: 'Axel',
                    year: '2015',
                    description: 'Trying to find out where the term binary file came from'
                }
            ];
			return {
                            addMovie: function(movie){
                                movies.push(movie);
                            }, 
                            getMovies: function(){
                                return movies;
                            }
			};
		})();

		// Lisää vakoilijat
	     spyOn(FirebaseServiceMock, 'addMovie').and.callThrough();

    	// Injektoi toteuttamasi kontrolleri tähän
	    inject(function($controller, $rootScope) {
	      scope = $rootScope.$new();
	      // Muista vaihtaa oikea kontrollerin nimi!
	      controller = $controller('NewMovieController', {
	        $scope: scope,
	        FirebaseService: FirebaseServiceMock
	      });
	    });
  	});

  	/*
  	* Testaa alla esitettyjä toimintoja kontrollerissasi
  	*/

  	/*
  	* Testaa, että käyttäjä pystyy lisäämään elokuvan oikeilla tiedoilla.
  	* Muista myös tarkistaa, että Firebasen kanssa keskustelevasta palvelusta
  	* on kutsutta oikeaa funktiota lisäämällä siihen vakoilijan ja käyttämällä
  	* toBeCalled-oletusta.
	*/
	it('should be able to add a movie by its name, director, release date and description', function(){
            movie = {};
            movie.name = 'asd';
            movie.director = 'asd';
            movie.year = '2015';
            movie.description = 'asd';
            scope.m = movie;
            
            scope.formAction();
            
            expect(FirebaseServiceMock.getMovies().length).toBe(2);
            expect(FirebaseServiceMock.addMovie).toHaveBeenCalled();
	});

	/*	
	* Testaa, ettei käyttäjä pysty lisäämään elokuvaa väärillä tiedoilla.
	* Muista myös tarkistaa, että Firebasen kanssa keskustelevasta palvelusta
	* EI kutsuta funktiota, joka hoitaa muokkauksen. Voit käyttää siihen
	* not.toBeCalled-oletusta (muista not-negaatio!).
	*/
	it('should not be able to add a movie if its name, director, release date or description is empty', function(){
            movie = {};
            movie.name = 'asd';
            movie.director = 'asd';
            movie.year = '2015';
            movie.description = '';
            scope.m = movie;
            
            scope.formAction();
            
            expect(FirebaseServiceMock.getMovies().length).toBe(1);
            expect(FirebaseServiceMock.addMovie).not.toHaveBeenCalled();
	});
});