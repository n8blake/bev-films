console.log("Recommendations");

const movie = new Movie("A Star Is Born");

const re = new RecommendationEngine();

console.log(re.getRecommendation(movie));