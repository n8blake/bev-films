console.log("Recommendations");
/*
class Pair {
  constructor(movie, drink){
    this.movie = movie;
    this.drink = drink;
  }
}

//const movie = new Movie("A Star Is Born");
const apiURL = 'https://www.omdbapi.com/?apikey=c8c161fc';

// When selecting a movie from the results list:
function getDetails(title) {
    let searchURL = apiURL + `&t=${title}`;
    return fetch(searchURL)
  .then(response => response.json())
  .then(data => {
  	return makeMovie(data);
  });
}

function makeMovie(data) {
    //printMovie(data);
    let media = new Movie(data.Title);
    media.year = data.Year;
    media.genre = data.Genre;
    media.director = data.Director;
    media.writer = data.Writer;
    media.plot = data.Plot;
    media.country = data.Country;
    media.poster = data.Poster;
    media.metascore = data.Metascore;
    media.imdbid = data.imdbID;
    media.type = data.Type;
    media.website = data.Website;
    return media;
    // TODO: Call Nate's function, passing Movie object.
}

function getDrink(pairedDrink, movie) {
    var api_name = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + pairedDrink;
    return fetch(api_name)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
    	let drinkData = {};
    	if(data.drinks){
    		drinkData.drink = data.drinks[0].strDrink;
    		drinkData.movie = movie;
    	}
       	return drinkData;
    });
};



const drink_api_name = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';

//const pairs = [{"movie":"Tomorrow Never Dies","drink":"Dirty Martini"},{"movie":"Goldfinger","drink":"Dirty Martini"},{"movie":"Golden Eye","drink":"Dirty Martini"},{"movie":"The World Is Not Enough","drink":"Dirty Martini"},{"movie":"Tinker Tailor Solider Spy","drink":"Dirty Martini"},{"movie":"Titanic","drink":"French 75"},{"movie":"The Great Gatsby","drink":"French 75"},{"movie":"Cars","drink":"Sidecar"},{"movie":"Baby Driver","drink":"Sidecar"},{"movie":"Drive","drink":"Sidecar"},{"movie":"Lilo and Stitch","drink":"Mai Tai"},{"movie":"Moana","drink":"Mai Tai"},{"movie":"Coco","drink":"Margarita"},{"movie":"Couples Retret","drink":"Margarita"},{"movie":"Sicario","drink":"Margarita"},{"movie":"The Santa Clause","drink":"Egg Nog"},{"movie":"Jingle All The Way","drink":"Egg Nog"},{"movie":"Home Alone","drink":"Egg Nog"},{"movie":"Frosty The Snowman","drink":"Egg Nog"},{"movie":"Elf","drink":"Egg Nog"},{"movie":"Brides Maids","drink":"Cosmo"},{"movie":"Pitch Perfect","drink":"Cosmo"},{"movie":"Legally Blonde","drink":"Cosmo"},{"movie":"Sex and the City","drink":"Cosmo"},{"movie":"Ghost Busters","drink":"Hurricane"},{"movie":"Suicide Squade","drink":"Hurricane"},{"movie":"Suicide Squade","drink":"Cosmo"},{"movie":"Birds of Prey","drink":"Cosmo"},{"movie":"Birds of Prey","drink":"Hurricane"},{"movie":"Oceans 11","drink":"Hurricane"},{"movie":"Oceans 12","drink":"Hurricane"},{"movie":"Oceans 12","drink":"Manhattan"},{"movie":"Oceans 11","drink":"Manhattan"},{"movie":"Inception","drink":"Manhattan"},{"movie":"Batman","drink":"Manhattan"},{"movie":"The Dark Knight","drink":"Manhattan"},{"movie":"Remember the Titains","drink":"Manhattan"},{"movie":"Rocky","drink":"Manhattan"},{"movie":"The Matrix","drink":"Manhattan"},{"movie":"Star Wars: Episode I - The Phantom Menace","drink":"Applejack"},{"movie":"Star Wars: Episode II - Attack of the Clones","drink":"Applejack"},{"movie":"Star Wars: Episode IV - A New Hope","drink":"Applejack"},{"movie":"Star Wars: Episode V - The Empire Strikes Back","drink":"Applejack"},{"movie":"Avatar","drink":"Applejack"},{"movie":"Avatar","drink":"Hurricane"},{"movie":"Lost In Space","drink":"Applejack"},{"movie":"Lost In Space","drink":"Hurricane"},{"movie":"Starship Troopers","drink":"Applejack"},{"movie":"Happy Gilmor","drink":"Long Island Iced Tea"},{"movie":"Happy Gilmor","drink":"Hurricane"},{"movie":"Step Brothers","drink":"Long Island Iced Tea"},{"movie":"Anchorman","drink":"Long Island Iced Tea"},{"movie":"Talladega Nights","drink":"Long Island Iced Tea"}];

const pairs = [{"movie":"Goldfinger","drink":"Dirty Martini"},{"movie":"Golden Eye","drink":"Dirty Martini"},{"movie":"The World Is Not Enough","drink":"Dirty Martini"},{"movie":"The Great Gatsby","drink":"French 75"},{"movie":"Baby Driver","drink":"Sidecar"},{"movie":"Moana","drink":"Mai Tai"},{"movie":"Sicario","drink":"Margarita"},{"movie":"The Santa Clause","drink":"Egg Nog #4"},{"movie":"Brides Maids","drink":"Cosmopolitan"},{"movie":"Ghost Busters","drink":"Blue Hurricane"},{"movie":"The Dark Knight","drink":"Manhattan"},{"movie":"Star Wars: Episode IV - A New Hope","drink":"Applejack"},{"movie":"Step Brothers","drink":"Long Island Iced Tea"}];
const movieList = document.querySelector("#movieList");

const movies = [];
const movieTexts = [];
const drinks = [];

// 
const MOVIE_PAIRS = [];
const DRINKS = [];
const MOVIES = [];

const getMovie = (title) => {
	let _movie = null;
	MOVIES.forEach(movie => {
		//console.log(movie.title === title);
		if(movie.title === title){
			_movie = movie;
		}
	});
	return _movie;
}

pairs.forEach(async (pair) => {
	//console.log(pair.movie);
	
	let details = Promise.resolve(getDetails(pair.movie));
	let drinkDetails = Promise.resolve(getDrink(pair.drink, pair.movie));	
	movies.push(details);
	drinks.push(drinkDetails);
	// let details = await getDetails(pair.movie);
	// if(details.title == undefined){
	// 	console.log(pair.movie);
	// } else {
	// 	movies.push(details);
	// }
	// console.log(details.toString());
});

const drinksPromiseArray = Promise.all(drinks).then(results => {
	//console.log(results);
	// populate DRINKS
	results.forEach(result => {
		if(result.drink != undefined){
			if(DRINKS.indexOf(result.drink) == -1){
				DRINKS.push(result.drink);
			}
			const pair = new Pair(result.movie, result.drink);
			MOVIE_PAIRS.push(pair);
			//console.log(result.movie);
		}	
	});
});

const moviesPromiseArray = Promise.all(movies).then(results => {
	//console.log(results);
	results.forEach(result => {
		if(getMovie(result.title) == undefined && result.title != undefined){
			MOVIES.push(result);
		}
	});
	//console.log(MOVIES);
});

Promise.all([drinksPromiseArray, moviesPromiseArray]).then(result => {
	console.log('done');
	MOVIE_PAIRS.forEach(pair => {
		//console.log(pair.movie);
		let movieObj = getMovie(pair.movie);
		//console.log(movieObj);
		if(movieObj != null){
			pair.movie = movieObj.toString();
		}
	});
	document.querySelector("#moviePairsJson").textContent = JSON.stringify(MOVIE_PAIRS);
	document.querySelector("#drinksList").textContent = JSON.stringify(DRINKS);

});

const runTest = () => {
	statusElement.textContent = "Getting drink details for Tomorrow Never Dies";
	getDetails('Tomorrow Never Dies').then(async movie => {
		//console.log(movie.toString());
		statusElement.textContent = "Getting recommendation...";
		spinner.style.display = 'block';
		let recommendation = await drinkRecommendation(movie.toString());
		console.log(recommendation);
		statusElement.textContent = "Recommedation: " + recommendation.drink;
		spinner.style.display = 'none';
	});
}
*/

const statusElement = document.querySelector("#status");
const spinner = document.querySelector("#spinner");
const movieInput = document.querySelector("#movieInput");

const getRecommendation = async () => {
	const movie = movieInput.value;
	spinner.style.display = 'block';
	statusElement.textContent = "Getting recommendation...";
	let recommendation = await drinkRecommendation(movie.toString());
	console.log(recommendation);
	statusElement.textContent = "Recommedation: " + recommendation.drink;
	spinner.style.display = 'none';
}




