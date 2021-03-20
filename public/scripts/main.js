/*
1.) User clicks to search. 
--Call searchMedia(), return results data
--Send results data to printResults()

2.) User selects a result.
--Event listener currently calls getDetails() directly
--Can implement a wrapper function in main
--Return movie data
--Call printMovie()
--Send movie data to passMovie(), return Drink
--Call bevrage function
*/

function searchFlow() {
    let searchResults = searchMedia();
    printResults(searchResults);
}

// Event listeners
// Listening elements defined in MovieSearch.js
searchButtonEl.on('click',searchMedia);
searchBoxEl.on('keyup', function(event) {
    if (event.keyCode === 13) {
        searchMedia();
    }
});
$(document).on('click', '.result-card', function(event) {
    let title = $(event.target).text();
    getDetails(title);
});