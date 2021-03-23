// Called when the user searches for a media title,
// and prints the results to the page
async function searchFlow() {
    let searchData = await searchMedia();
    if(searchData.Search){
        printMediaResults(searchData);
    }
}

// Called when the user selects a search result.
async function mediaSelected(title) {
    getMediaDetails(title).then(result => {
        const mediaData = result;
        printMediaDetails(mediaData);
        let selectedMedia = createMovie(mediaData);
        let mediaString = selectedMedia.toString();
        console.log(mediaString);
        imgEl.style.display = 'none';
        ingrdientEl.style.display = 'none';
        pourEl.style.display = 'none';
        nameEl.textContent = 'Getting recommendation...';
        const spinner = document.querySelector('#recommendation-spinner');
        spinner.style.display = 'block';
        var recommendationsStorage = localStorage.getItem('recommendations');
        if(recommendationsStorage != null){
            recommendationsStorage = JSON.parse(recommendationsStorage);
        }
        if(recommendationsStorage && recommendationsStorage[title]){
            spinner.style.display = 'none';
            imgEl.style.display = 'block';
            ingrdientEl.style.display = 'block';
            pourEl.style.display = 'block';;
            getDrink(recommendationsStorage[title].drink);
        } else {
            const recommendationWorker = new Worker('public/scripts/RecommendationEngine.js');
            recommendationWorker.addEventListener('message', function(e) {
                spinner.style.display = 'none';
                imgEl.style.display = 'block';
                ingrdientEl.style.display = 'block';
                pourEl.style.display = 'block';;
                let recommendation = e.data;
                getDrink(recommendation.drink);
                if(recommendationsStorage == null){
                    recommendationsStorage = {};
                }
                recommendationsStorage[title] = e.data;
                recommendationsStorage = JSON.stringify(recommendationsStorage);
                localStorage.setItem('recommendations', recommendationsStorage);
            }, false);
            recommendationWorker.postMessage(mediaString);
        }
    });
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