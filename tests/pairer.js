const movies = [
'Tomorrow Never Dies', 'Goldfinger', 'Golden Eye', 'The World Is Not Enough', 'Tinker Tailor Solider Spy',
'Titanic', 'The Great Gatsby',
'Cars', 'Baby Driver', 'Drive',
'Lilo and Stitch', 'Moana', 
'Sicario', 'Coco', 'Couples Retret',
'The Santa Clause', 'Jingle All The Way', 'Home Alone', 'Frosty The Snowman', 'Elf',
'Brides Maids', 'Pitch Perfect', 'Legally Blonde', 'Sex and the City',
'Ghost Busters', 'Suicide Squade', 'Birds of Prey', 'Oceans 11', 'Oceans 12',
'Inception', 'Batman', 'The Dark Knight', 'Remember the Titains', 'Rocky', 'The Matrix',
'Star Wars: Episode I', 'Star Wars: Episode II', 'Star Wars: Episode IV', 'Star Wars: Episode V',
'Avatar', 'Lost In Space', 'Starship Troopers',
'Happy Gilmor', 'Step Brothers', 'Anchorman', 'Talladega Nights'
];

const drinks = [
'Dirty Martini',
'French 75',
'Sidecar',
'Margarita',
'Mai Tai',
'Egg Nog',
'Cosmo',
'Hurricane',
'Manhattan',
'Tokio Iced Tea',
'Long Island Iced Tea'
];


class Pair {
  constructor(movie, drink){
    this.movie = movie;
    this.drink = drink;
  }
}

const output = document.querySelector("#output");

const savePairData = () => {
  const data = JSON.stringify(pairs);
  /*if(localStorage){
  const data = JSON.stringify(pairs);
  localStorage.setItem('pairData', data);
  }*/
  output.textContent = data;
}

const loadPairData = () => {
  if(localStorage){
  let data = localStorage.getItem('pairData');
  if(data === null){
    data = [];
    return data;
  } else {
    return JSON.parse(data);
  }
  }
}

const pairs = [];

const makePair = (movie, drink) => {
  const movieIndex = movies.indexOf(movie);
  const drinkIndex = drinks.indexOf(drink);
  const pair = new Pair(movies[movieIndex], drinks[drinkIndex]);
  pairs.push(pair);
  //console.log(pairs);
  console.log(pairs);
  savePairData();
}

const unPair = (movie, drink) => {
  let index = -1;
  pairs.forEach(pair => {
    //console.log(pair.movie);
    if(pair.movie == movie && pair.drink == drink){
      index = pairs.indexOf(pair);
    } 
  });
  if(index > -1){
    pairs.splice(index, 1);
  }
  console.log(pairs);
  savePairData();
}

const makePairFromOption = (event) => {
  let option = event.target;
  console.log(option.dataset.movie);
  console.log(option.dataset.drink);
  makePair(option.dataset.movie, option.dataset.drink);
  option.classList.add('selected');
  option.removeEventListener('click', makePairFromOption);
  option.addEventListener('click', unPairFromOption);
}

const unPairFromOption = (event) => {
  let option = event.target;
  //console.log(option.dataset.movie);
  //console.log(option.dataset.drink);
  unPair(option.dataset.movie, option.dataset.drink);
  option.classList.remove('selected');
  option.removeEventListener('click', unPairFromOption);
  option.addEventListener('click', makePairFromOption);
}

const isPair = (drink, movie) => {
  let isPair = false;
  pairs.forEach(pair => {
    //console.log(pair.movie);
    if(pair.movie == movie && pair.drink == drink){
      isPair = true;
    } 
  });
  return isPair;
}

//makePair(movies[0], drinks[1]);

const initMovieList = () => {
  var movieList = document.querySelector("#movieList");

  movieList.innerHTML = "";

  // for each movie, make a list item
  movies.forEach(movie =>{
    const listItem = makeMovieListItem(movie);
    movieList.appendChild(listItem);
  });
};

const makeMovieListItem = (movie) => {
  const li = document.createElement('li');
  const movieName = document.createElement('div');
  movieName.classList.add('movieName');
  movieName.textContent = movie;
  li.appendChild(movieName);
  const drinkOptions = document.createElement('div');
  drinkOptions.id = movie + '-drink-options';
  drinkOptions.classList.add('drinkOptions');
  // foreach drink, create a drink option
  drinks.forEach(drink => {
    const span = document.createElement('span');
    span.id = 'option-' + movie + '-' + drink;
    span.dataset.movie = movie;
    span.dataset.drink = drink;
    span.classList.add('drinkOption');
    if(isPair(drink, movie)){
      span.classList.add('selected');
      span.addEventListener('click', unPairFromOption);
    } else {
      span.addEventListener('click', makePairFromOption);
    }
    span.textContent = drink;
    
    drinkOptions.appendChild(span);
  });
  li.appendChild(drinkOptions);
  return li;
}

initMovieList();

const pairTab = document.querySelector("#pairTabSpan");
const outputTab = document.querySelector("#outputTabSpan");
const pairSection = document.querySelector("#pairing-section");
const outputSection = document.querySelector("#output-section");

const toggleTab = (event) => {
	const target = event.target;
	const text = target.textContent;
	console.log(text);
	if(text === 'Output'){
		pairTab.classList.remove('selected');
		pairSection.style.display = 'none';
		outputSection.style.display = 'block';
	} else {
		outputTab.classList.remove('selected');
		pairSection.style.display = 'block';
		outputSection.style.display = 'none';
	}
	target.classList.add('selected');
}

pairTab.addEventListener('click', toggleTab);
outputTab.addEventListener('click', toggleTab);

