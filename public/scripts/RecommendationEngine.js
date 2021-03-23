// You betta werk...
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs', 'https://cdn.jsdelivr.net/npm/@tensorflow-models/universal-sentence-encoder');
var textCompareModel = null;
self.addEventListener('message', function(e) {
  use.load().then(async (model) => {   
    textCompareModel = model;
    drinkRecommendation(e.data).then(recommendation => {
      self.postMessage(recommendation);
    });
  });
}, false);

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
  console.log(text1);
  console.log(text2);
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
  console.log(movieText);
  let drinkRecommendations = [];
  DRINKS.forEach(drink => {
    const drinkRecommendation = generateRecommendationIndex(movieText, drink);
    drinkRecommendations.push(drinkRecommendation);
  });
  return Promise.all(drinkRecommendations).then((recommedations) =>{
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
    console.log(recommedations);
    return recommedation;
  });
}

const MOVIE_PAIRS = [{"movie":"Goldfinger James Bond 1964 Action, Adventure, Thriller Guy Hamilton Richard Maibaum (screenplay by), Paul Dehn (screenplay by) While investigating a gold magnate's smuggling, James Bond uncovers a plot to contaminate the Fort Knox gold reserve. UK movie","drink":"Dirty Martini"},
{"movie":"Goldeneye James Bond Action, Adventure, Thriller Pierce Brosnan, Sean Bean, Izabella Scorupco, Famke Janssen Years after a friend and fellow 00 agent is killed on a joint mission, a secret space based weapons program known as \"GoldenEye\" is stolen. James Bond sets out to stop a Russian crime syndicate from using the weapon.","drink":"Dirty Martini"},
{"movie":"The World Is Not Enough James Bond 1999 Action, Adventure, Crime, Thriller Michael Apted Neal Purvis (story), Robert Wade (story), Neal Purvis (screenplay), Robert Wade (screenplay), Bruce Feirstein (screenplay) James Bond uncovers a nuclear plot while protecting an oil heiress from her former kidnapper, an international terrorist who can't feel pain. UK, USA movie","drink":"Dirty Martini"},
{"movie":"The Great Gatsby 2013 Drama, Romance Baz Luhrmann Baz Luhrmann (screenplay), Craig Pearce (screenplay), F. Scott Fitzgerald (based on the novel by) A writer and wall street trader, Nick, finds himself drawn to the past and lifestyle of his millionaire neighbor, Jay Gatsby. Australia, USA movie","drink":"French 75"},
{"movie":"Baby Driver 2017 Action, Crime, Drama, Music, Thriller Edgar Wright Edgar Wright After being coerced into working for a crime boss, a young getaway driver finds himself taking part in a heist doomed to fail. UK, USA movie","drink":"Sidecar"},
{"movie":"Moana 2016 Animation, Adventure, Comedy, Family, Fantasy, Musical Ron Clements, John Musker, Don Hall(co-director), Chris Williams(co-director) Jared Bush (screenplay by), Ron Clements (story by), John Musker (story by), Chris Williams (story by), Don Hall (story by), Pamela Ribon (story by), Aaron Kandell (story by), Jordan Kandell (story by) In Ancient Polynesia, when a terrible curse incurred by the Demigod Maui reaches Moana's island, she answers the Ocean's call to seek out the Demigod to set things right. USA movie","drink":"Mai Tai"},
{"movie":"Sicario 2015 Action, Crime, Drama, Mystery, Thriller Denis Villeneuve Taylor Sheridan An idealistic FBI agent is enlisted by a government task force to aid in the escalating war against drugs at the border area between the U.S. and Mexico. USA, Mexico, Hong Kong movie","drink":"Margarita"},{"movie":"The Santa Clause 1994 Comedy, Drama, Family, Fantasy John Pasquin Leo Benvenuti, Steve Rudnick When a man inadvertently makes Santa fall off of his roof on Christmas Eve, he finds himself magically recruited to take his place. USA, Canada movie","drink":"Egg Nog #4"},
{"movie":"Bridesmaids 2011 Comedy, Romance Paul Feig Kristen Wiig, Annie Mumolo Competition between the maid of honor and a bridesmaid, over who is the bride's best friend, threatens to upend the life of an out-of-work pastry chef. USA movie","drink":"Cosmopolitan"},
{"movie":"Ghostbusters 1984 Action, Comedy, Fantasy, Sci-Fi Ivan Reitman Dan Aykroyd, Harold Ramis Three former parapsychology professors set up shop as a unique ghost removal service. USA movie","drink":"Blue Hurricane"},
{"movie":"The Dark Knight 2008 Action, Crime, Drama, Thriller Christopher Nolan Jonathan Nolan (screenplay), Christopher Nolan (screenplay), Christopher Nolan (story), David S. Goyer (story), Bob Kane (characters) When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice. USA, UK movie","drink":"Manhattan"},
{"movie":"Star Wars: Episode IV - A New Hope 1977 Action, Adventure, Fantasy, Sci-Fi George Lucas George Lucas Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station, while also attempting to rescue Princess Leia from the mysterious Darth Vader. USA, UK movie","drink":"Applejack"},
{"movie":"Step Brothers 2008 Comedy Adam McKay Will Ferrell (screenplay), Adam McKay (screenplay), Will Ferrell (story), Adam McKay (story), John C. Reilly (story) Two aimless middle-aged losers still living at home are forced against their will to become roommates when their parents marry. USA movie","drink":"Long Island Iced Tea"}];
//const MOVIE_PAIRS = [{"movie":"Tomorrow Never Dies 1997 Action, Adventure, Thriller Roger Spottiswoode Bruce Feirstein James Bond sets out to stop a media mogul's plan to induce war between China and the UK in order to obtain exclusive global media coverage. UK, USA movie","drink":"Dirty Martini"},{"movie":"Goldfinger 1964 Action, Adventure, Thriller Guy Hamilton Richard Maibaum (screenplay by), Paul Dehn (screenplay by) While investigating a gold magnate's smuggling, James Bond uncovers a plot to contaminate the Fort Knox gold reserve. UK movie","drink":"Dirty Martini"},{"movie":"Golden Eye","drink":"Dirty Martini"},{"movie":"The World Is Not Enough 1999 Action, Adventure, Crime, Thriller Michael Apted Neal Purvis (story), Robert Wade (story), Neal Purvis (screenplay), Robert Wade (screenplay), Bruce Feirstein (screenplay) James Bond uncovers a nuclear plot while protecting an oil heiress from her former kidnapper, an international terrorist who can't feel pain. UK, USA movie","drink":"Dirty Martini"},{"movie":"Tinker Tailor Solider Spy","drink":"Dirty Martini"},{"movie":"Titanic 1997 Drama, Romance James Cameron James Cameron A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic. USA, Mexico, Australia, Canada movie","drink":"French 75"},{"movie":"The Great Gatsby 2013 Drama, Romance Baz Luhrmann Baz Luhrmann (screenplay), Craig Pearce (screenplay), F. Scott Fitzgerald (based on the novel by) A writer and wall street trader, Nick, finds himself drawn to the past and lifestyle of his millionaire neighbor, Jay Gatsby. Australia, USA movie","drink":"French 75"},{"movie":"Cars 2006 Animation, Comedy, Family, Sport John Lasseter, Joe Ranft(co-director) John Lasseter (original story by), Joe Ranft (original story by), Jorgen Klubien (original story by), Dan Fogelman (screenplay by), John Lasseter (screenplay by), Joe Ranft (screenplay by), Kiel Murray (screenplay by), Phil Lorin (screenplay by), Jorgen Klubien (screenplay by) A hot-shot race-car named Lightning McQueen gets waylaid in Radiator Springs, where he finds the true meaning of friendship and family. USA movie","drink":"Sidecar"},{"movie":"Baby Driver 2017 Action, Crime, Drama, Music, Thriller Edgar Wright Edgar Wright After being coerced into working for a crime boss, a young getaway driver finds himself taking part in a heist doomed to fail. UK, USA movie","drink":"Sidecar"},{"movie":"Drive 2011 Crime, Drama Nicolas Winding Refn Hossein Amini (screenplay), James Sallis (book) A mysterious Hollywood stuntman and mechanic moonlights as a getaway driver and finds himself in trouble when he helps out his neighbor. USA movie","drink":"Sidecar"},{"movie":"Lilo and Stitch","drink":"Mai Tai"},{"movie":"Moana 2016 Animation, Adventure, Comedy, Family, Fantasy, Musical Ron Clements, John Musker, Don Hall(co-director), Chris Williams(co-director) Jared Bush (screenplay by), Ron Clements (story by), John Musker (story by), Chris Williams (story by), Don Hall (story by), Pamela Ribon (story by), Aaron Kandell (story by), Jordan Kandell (story by) In Ancient Polynesia, when a terrible curse incurred by the Demigod Maui reaches Moana's island, she answers the Ocean's call to seek out the Demigod to set things right. USA movie","drink":"Mai Tai"},{"movie":"Coco 2017 Animation, Adventure, Family, Fantasy, Music, Mystery Lee Unkrich, Adrian Molina(co-director) Lee Unkrich (original story by), Jason Katz (original story by), Matthew Aldrich (original story by), Adrian Molina (original story by), Adrian Molina (screenplay by), Matthew Aldrich (screenplay by) Aspiring musician Miguel, confronted with his family's ancestral ban on music, enters the Land of the Dead to find his great-great-grandfather, a legendary singer. USA, Mexico movie","drink":"Margarita"},{"movie":"Couples Retret","drink":"Margarita"},{"movie":"Sicario 2015 Action, Crime, Drama, Mystery, Thriller Denis Villeneuve Taylor Sheridan An idealistic FBI agent is enlisted by a government task force to aid in the escalating war against drugs at the border area between the U.S. and Mexico. USA, Mexico, Hong Kong movie","drink":"Margarita"},{"movie":"The Santa Clause 1994 Comedy, Drama, Family, Fantasy John Pasquin Leo Benvenuti, Steve Rudnick When a man inadvertently makes Santa fall off of his roof on Christmas Eve, he finds himself magically recruited to take his place. USA, Canada movie","drink":"Egg Nog #4"},{"movie":"Jingle All The Way","drink":"Egg Nog #4"},{"movie":"Home Alone 1990 Comedy, Family Chris Columbus John Hughes An eight-year-old troublemaker must protect his house from a pair of burglars when he is accidentally left home alone by his family during Christmas vacation. USA movie","drink":"Egg Nog #4"},{"movie":"Frosty The Snowman","drink":"Egg Nog #4"},{"movie":"Elf 2003 Adventure, Comedy, Family, Fantasy, Romance Jon Favreau David Berenbaum Buddy, a human, is raised amongst elves at the North Pole. When he discovers that he is not an elf, he travels to New York to search for his biological father. USA movie","drink":"Egg Nog #4"},{"movie":"Brides Maids","drink":"Cosmopolitan"},{"movie":"Pitch Perfect 2012 Comedy, Music, Romance Jason Moore Kay Cannon (screenplay), Mickey Rapkin (based on the book by) Beca, a freshman at Barden University, is cajoled into joining The Bellas, her school's all-girls singing group. Injecting some much needed energy into their repertoire, The Bellas take on their male rivals in a campus competition. USA movie","drink":"Cosmopolitan"},{"movie":"Legally Blonde 2001 Comedy, Romance Robert Luketic Amanda Brown (novel), Karen McCullah (screenplay), Kirsten Smith (screenplay) Elle Woods, a fashionable sorority queen, is dumped by her boyfriend. She decides to follow him to law school. While she is there, she figures out that there is more to her than just looks. USA movie","drink":"Cosmopolitan"},{"movie":"Sex and the City 1998–2004 Comedy, Drama, Romance N/A Darren Star Four female New Yorkers gossip about their sex lives (or lack thereof) and find new ways to deal with being a woman in the late 1990s. USA series","drink":"Cosmopolitan"},{"movie":"Ghost Busters","drink":"Blue Hurricane"},{"movie":"Suicide Squade","drink":"Blue Hurricane"},{"movie":"Suicide Squade","drink":"Cosmopolitan"},{"movie":"Birds of Prey 2020 Action, Adventure, Comedy, Crime Cathy Yan Christina Hodson, Paul Dini (Harley Quinn created by), Bruce Timm (Harley Quinn created by) After splitting with the Joker, Harley Quinn joins superheroes Black Canary, Huntress and Renee Montoya to save a young girl from an evil crime lord. USA movie","drink":"Cosmopolitan"},{"movie":"Birds of Prey 2020 Action, Adventure, Comedy, Crime Cathy Yan Christina Hodson, Paul Dini (Harley Quinn created by), Bruce Timm (Harley Quinn created by) After splitting with the Joker, Harley Quinn joins superheroes Black Canary, Huntress and Renee Montoya to save a young girl from an evil crime lord. USA movie","drink":"Blue Hurricane"},{"movie":"Oceans 11","drink":"Blue Hurricane"},{"movie":"Oceans 12","drink":"Blue Hurricane"},{"movie":"Oceans 12","drink":"Manhattan"},{"movie":"Oceans 11","drink":"Manhattan"},{"movie":"Inception 2010 Action, Adventure, Sci-Fi, Thriller Christopher Nolan Christopher Nolan A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O. USA, UK movie","drink":"Manhattan"},{"movie":"Batman 1989 Action, Adventure Tim Burton Bob Kane (Batman characters), Sam Hamm (story), Sam Hamm (screenplay), Warren Skaaren (screenplay) The Dark Knight of Gotham City begins his war on crime with his first major enemy being Jack Napier, a criminal who becomes the clownishly homicidal Joker. USA, UK movie","drink":"Manhattan"},{"movie":"The Dark Knight 2008 Action, Crime, Drama, Thriller Christopher Nolan Jonathan Nolan (screenplay), Christopher Nolan (screenplay), Christopher Nolan (story), David S. Goyer (story), Bob Kane (characters) When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice. USA, UK movie","drink":"Manhattan"},{"movie":"Remember the Titains","drink":"Manhattan"},{"movie":"Rocky 1976 Drama, Sport John G. Avildsen Sylvester Stallone A small-time boxer gets a supremely rare chance to fight a heavyweight champion in a bout in which he strives to go the distance for his self-respect. USA movie","drink":"Manhattan"},{"movie":"The Matrix 1999 Action, Sci-Fi Lana Wachowski, Lilly Wachowski Lilly Wachowski, Lana Wachowski When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence. USA movie","drink":"Manhattan"},{"movie":"Star Wars: Episode I - The Phantom Menace 1999 Action, Adventure, Fantasy, Sci-Fi George Lucas George Lucas Two Jedi escape a hostile blockade to find allies and come across a young boy who may bring balance to the Force, but the long dormant Sith resurface to claim their original glory. USA movie","drink":"Applejack"},{"movie":"Star Wars: Episode II - Attack of the Clones 2002 Action, Adventure, Fantasy, Sci-Fi George Lucas George Lucas (screenplay by), Jonathan Hales (screenplay by), George Lucas (story by) Ten years after initially meeting, Anakin Skywalker shares a forbidden romance with Padmé Amidala, while Obi-Wan Kenobi investigates an assassination attempt on the senator and discovers a secret clone army crafted for the Jedi. USA movie","drink":"Applejack"},{"movie":"Star Wars: Episode IV - A New Hope 1977 Action, Adventure, Fantasy, Sci-Fi George Lucas George Lucas Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station, while also attempting to rescue Princess Leia from the mysterious Darth Vader. USA, UK movie","drink":"Applejack"},{"movie":"Star Wars: Episode V - The Empire Strikes Back 1980 Action, Adventure, Fantasy, Sci-Fi Irvin Kershner Leigh Brackett (screenplay by), Lawrence Kasdan (screenplay by), George Lucas (story by) After the Rebels are brutally overpowered by the Empire on the ice planet Hoth, Luke Skywalker begins Jedi training with Yoda, while his friends are pursued by Darth Vader and a bounty hunter named Boba Fett all over the galaxy. USA, UK movie","drink":"Applejack"},{"movie":"Avatar 2009 Action, Adventure, Fantasy, Sci-Fi James Cameron James Cameron A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home. USA movie","drink":"Applejack"},{"movie":"Avatar 2009 Action, Adventure, Fantasy, Sci-Fi James Cameron James Cameron A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home. USA movie","drink":"Blue Hurricane"},{"movie":"Lost In Space","drink":"Applejack"},{"movie":"Lost In Space","drink":"Blue Hurricane"},{"movie":"Starship Troopers 1997 Action, Adventure, Sci-Fi, Thriller Paul Verhoeven Edward Neumeier (screenplay), Robert A. Heinlein (book) Humans in a fascist, militaristic future wage war with giant alien bugs. USA movie","drink":"Applejack"},{"movie":"Happy Gilmor","drink":"Long Island Iced Tea"},{"movie":"Happy Gilmor","drink":"Blue Hurricane"},{"movie":"Step Brothers 2008 Comedy Adam McKay Will Ferrell (screenplay), Adam McKay (screenplay), Will Ferrell (story), Adam McKay (story), John C. Reilly (story) Two aimless middle-aged losers still living at home are forced against their will to become roommates when their parents marry. USA movie","drink":"Long Island Iced Tea"},{"movie":"Anchorman 2009 Short Salvatore D'Alia Salvatore D'Alia N/A Italy movie","drink":"Long Island Iced Tea"},{"movie":"Talladega Nights","drink":"Long Island Iced Tea"}];
// const MOVIE_PAIRS = [{"movie":"Goldfinger  While investigating a gold magnate's smuggling, James Bond 007 uncovers a plot to contaminate the Fort Knox gold reserve.","drink":"Dirty Martini"},
// {"movie":'GoldenEye Years after a friend and fellow 00 agent is killed on a joint mission, a secret space based weapons program known as "GoldenEye" is stolen. James Bond 007 sets out to stop a Russian crime syndicate from using the weapon.',"drink":"Dirty Martini"},
// {"movie":"The World Is Not Enough James Bond uncovers a nuclear plot while protecting an oil heiress from her former kidnapper, an international terrorist who can't feel pain.","drink":"Dirty Martini"},
// {"movie":"The Great Gatsby A writer and wall street trader, Nick, finds himself drawn to the past and lifestyle of his millionaire neighbor, Jay Gatsby.","drink":"French 75"},
// {"movie":"Baby Driver After being coerced into working for a crime boss, a young getaway driver finds himself taking part in a heist doomed to fail.","drink":"Sidecar"},
// {"movie":"Moana In Ancient Polynesia, when a terrible curse incurred by the Demigod Maui reaches Moana's island, she answers the Ocean's call to seek out the Demigod to set things right.","drink":"Mai Tai"},
// {"movie":"Sicario An idealistic FBI agent is enlisted by a government task force to aid in the escalating war against drugs at the border area between the U.S. and Mexico.","drink":"Margarita"},
// {"movie":"The Santa Clause When a man inadvertently makes Santa fall off of his roof on Christmas Eve, he finds himself magically recruited to take his place.","drink":"Egg Nog #4"},
// {"movie":"Bridesmaids Competition between the maid of honor and a bridesmaid, over who is the bride's best friend, threatens to upend the life of an out-of-work pastry chef. USA movie","drink":"Cosmopolitan"},
// {"movie":"Ghostbusters Three former parapsychology professors set up shop as a unique ghost removal service. USA movie","drink":"Blue Hurricane"},
// {"movie":"The Dark Knight When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.","drink":"Manhattan"},
// {"movie":"Star Wars: Episode IV - A New Hope Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station, while also attempting to rescue Princess Leia from the mysterious Darth Vader.","drink":"Applejack"},
// {"movie":"Step Brothers Two aimless middle-aged losers still living at home are forced against their will to become roommates when their parents marry.","drink":"Long Island Iced Tea"}];


const DRINKS = ["Dirty Martini","French 75","Sidecar","Mai Tai","Margarita","Egg Nog #4","Cosmopolitan","Blue Hurricane","Manhattan","Applejack","Long Island Iced Tea"];