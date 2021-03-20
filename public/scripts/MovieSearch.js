const searchButtonEl = $('#search-button');
const searchBoxEl = $('#search-box');
const resultsListEl = $('#search-results');
const movieTitleEl = $('#movie-title');
const posterEl = $('#movie-poster');
const moviePlotEl = $('#movie-plot');
const movieLinkEl = $('#movie-link');
const featuredPairingsEl = $('#featured-pairings');
const recommendedPairingEl = $('#recommended-pairing');

const apiURL = 'https://www.omdbapi.com/?apikey=c8c161fc';

async function searchMedia() {
    let searchURL = apiURL + `&s=${searchBoxEl.val()}`;
    let results = await fetch(searchURL)
  .then(response => response.json());
    return results;
}

function printMediaResults(data) {
    resultsListEl.html('');
    let results = data.Search;
    for (let i = 0; i < results.length; i++) {
        let newResult = $(`<li class="result-card hover:bg-gray-700 hover:text-gray-200" style="cursor:pointer">${results[i].Title}</li>`);
        resultsListEl.append(newResult);
    }
}

async function getMediaDetails(title) {
    let searchURL = apiURL + `&t=${title}`;
    let result = fetch(searchURL)
  .then(response => response.json());
    return result;
}

function createMovie(data) {
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
}

function printMediaDetails(data) {
    featuredPairingsEl.attr('style','display:none;');
    recommendedPairingEl.removeClass('invisible');
    movieTitleEl.text(data.Title);
    if (data.Poster !== 'N/A') {
        posterEl.attr('src',`${data.Poster}`);
    } else {
        posterEl.attr('src','https://www.rit.edu/nsfadvance/sites/rit.edu.nsfadvance/files/default_images/photo-unavailable.png');
    }
    moviePlotEl.text(`Plot: ${data.Plot}`);
    movieLinkEl.attr('href', `https://www.imdb.com/title/${data.imdbID}`);
}