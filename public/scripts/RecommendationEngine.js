"use strict";

var textCompareModel = null;

use.load().then(model => {
  textCompareModel = model;
  let btn = document.querySelector('#generateRecomendationBtn');
  btn.disabled = false;
  btn.addEventListener('click', getRecommendation);
});

// Use the TensorFlow Model to compare two text strings,
// return a float that represent how closely (0 to 1) the
// strings match eachother. A 1 is a perfect match. A 0 
// is no match. The function runs ayscronously.
const match = async(text1, text2) => {
  const texts = [text1, text2];
  const embeddings = await textCompareModel.embed(texts);
  const text1tf = tf.slice(embeddings, [0, 0], [1]);
  const text2tf = tf.slice(embeddings, [1, 0], [1]);
  const idx = tf.matMul(text1tf, text2tf, false, true).dataSync();
  console.log(idx);
  return idx;
}

// Using the modified Jaccard Index method, 
// generate a drink recommendation base on how 
// well a movie matches other movies from the 
// sample set which have alreay been pair with
// drinks.
// ModifiedJaccardIndex(inputMovie, inputDrink) = ( sum( MOVIES_PAIRED_SET.forEach(_MOVIE => match(_MOVIE, inputMovie) )) ) / MOVIES_PAIRED_SET.length
const generateRecommendationIndex = async (inputMovie, inputDrink) => {
  let sum = 0;
  let iteration = 0;
  const moviesPairedSet = getMoviePairSet(inputDrink);
  if(moviesPairedSet.length === 0) return 0;
  let matchIndicies = [];
  moviesPairedSet.forEach((moviePair) =>  {
    const matchIndex = Promise.resolve(match(moviePair, inputMovie));
    matchIndicies.push(matchIndex);
  });
  return Promise.all(matchIndicies).then((result) => {
    result.forEach(index => {
      sum = sum + index[0];
    });
    const recommedation = {};
    recommedation.drink = inputDrink;
    recommedation.score = sum / moviesPairedSet.length;
    return recommedation;
  });
}

// Get the sample drinks
const getMoviePairSet = (inputDrink) => {
  const moviePairSet = [];
  MOVIE_PAIRS.forEach(pair => {
    if(pair.drink === inputDrink){
      moviePairSet.push(pair.movie);
    }
  });
  return moviePairSet;
}

// Provided a movie as string, generate a drink recommendation 
const drinkRecommendation = (movieText) => {
  let drinkRecommendations = [];
  DRINKS.forEach(drink => {
    const drinkRecommendation = generateRecommendationIndex(movieText, drink);
    drinkRecommendations.push(drinkRecommendation);
  });
  return Promise.all(drinkRecommendations).then((recommedations) =>{
    console.log(recommedations);
    let drink = null;
    let score = 0;
    recommedations.forEach(rec => {
      if(rec){
        if(score < rec.score){
          score = rec.score;
          drink = rec.drink;
        }
      }
    });
    const recommedation = {};
    recommedation.score = score;
    recommedation.drink = drink;
    return recommedation;
  });
}