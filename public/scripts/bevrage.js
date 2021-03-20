var imgEl = document.querySelector('#drinkimg')
var ingrdientEl = document.querySelector('#ingrdient')
var pourEl = document.querySelector('#pour')
var selectBtn = document.querySelector('#drinkpage')
var nameEl = document.querySelector('#drink_name')

// create dynamic variables
var ingredientlist = [];
var obj = {};
var measurelist = [];
var obj_measure ={};
for (let i = 0; i < 15; i++) {
    ingredientlist[i] = "strIngredient"+(i+1);
    obj[i] = ingredientlist[i]
}

for (let i = 0; i < 15; i++) {
    measurelist[i] = "strMeasure"+(i+1);
    obj_measure[i] = measurelist[i]
}

// search a drink by its catagory and then random pick a drink inside catagory
// function getCategories(catagory){
//     var api_catagories = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=' + catagory;

//     fetch(api_catagories)
//     .then(function (response) {
//         return response.json();
//     })
//     .then(function (data) {
//         var listID = [...Array(data.drinks.length).keys()];
//         var randomID = listID[Math.floor(Math.random() * listID.length)];
//         var pairedDrink = data.drinks[randomID].strDrink;
//         getDrink(pairedDrink);
//     });
// }


// search a drink by its name
function getDrink(pairedDrink) {
    var api_name = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + pairedDrink;
    fetch(api_name)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
            var pageurl = 'https://www.thecocktaildb.com/drink/' + data.drinks[0].idDrink;
            selectBtn.setAttribute("href",pageurl);
            imgEl.setAttribute("src",data.drinks[0].strDrinkThumb);
            imgEl.setAttribute("alt",data.drinks[0].strDrink);
            nameEl.innerHTML = data.drinks[0].strDrink;

            for (let i = 0; i < 15; i++) {
                if (data.drinks[0][obj[i]] !== null){
                    var ingUl = document.createElement('ul');
                    var ingli = document.createElement('li');

                    ingli.textContent = data.drinks[0][obj[i]];
                    ingrdientEl.appendChild(ingUl);
                    ingUl.appendChild(ingli);
                }
            }

            for (let i = 0; i < 15; i++) {
                if (data.drinks[0][obj_measure[i]] !== null){
                    var pourUl = document.createElement('ul');
                    var pourli = document.createElement('li');

                    pourli.textContent = data.drinks[0][obj_measure[i]];
                    pourEl.appendChild(pourUl);
                    pourUl.appendChild(pourli);
                }
            }
    });
};
