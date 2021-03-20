// Called when the user searches for a media title,
// and prints the results to the page
async function searchFlow() {
    let searchData = await searchMedia();
    printMediaResults(searchData);
}

// Called when the user selects a search result.
async function mediaSelected(title) {
    let mediaData = await getMediaDetails(title);
    printMediaDetails(mediaData);
    let selectedMedia = createMovie(mediaData);
    let mediaString = selectedMedia.toString();
    // let recommendation = await drinkRecommendation(mediaString);
    // getDrink(recommendation.drink);
}

// Event listeners
// Listening elements defined in MovieSearch.js
searchButtonEl.on('click',searchFlow);
searchBoxEl.on('keyup', function(event) {
    if (event.keyCode === 13) {
        searchFlow();
    }
});
$(document).on('click', '.result-card', function(event) {
    let title = $(event.target).text();
    mediaSelected(title);
});