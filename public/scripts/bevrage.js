// Fetch data from https://www.thecocktaildb.com/api
// Put data in lists

function getCategories() {
    var api_categories = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list';
    let list = [];
    fetch(api_categories)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        var list = data.drinks;
        console.log(list)
    });
};

// function getGlasses() {
//     var api_Glasses = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?g=list';
    
//     fetch(api_Glasses)
//     .then(function (response) {
//         return response.json();
//     })
//     .then(function (data) {
//         var list = data.drinks;
//         return list;
//     });
// };


// function getIngredients() {
//     var api_ingredients = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list';
    
//     fetch(api_ingredients)
//     .then(function (response) {
//         return response.json();
//     })
//     .then(function (data) {
//         var list = data.drinks;
//         return list;
//     });
// }

// function getAlcoholic() {
//     var api_alcoholic = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?a=list';
    
//     fetch(api_alcoholic)
//     .then(function (response) {
//         return response.json();
//     })
//     .then(function (data) {
//         var list = data.drinks;
//         return list;
//     });
// };

// getDrink by catagories
var getDrink_C = function (catagory) {
    var drinkBycatagory = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=' + catagory;
  
    fetch(drinkBycatagory)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        // displayDrink(...)
    });
};

// // getDrink by glasses
// var getDrink_G = function (glass) {
//     var drinkBycatagory = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?g=' + glass;
  
//     fetch(drinkBycatagory)
//     .then(function (response) {
//         return response.json();
//     })
//     .then(function (data) {
//         // displayDrink(...)
//     });
// };

// // getDrink by ingredient
// var getDrink_I = function (ingredient) {
//     var drinkBycatagory = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + ingredient;
  
//     fetch(drinkBycatagory)
//     .then(function (response) {
//         return response.json();
//     })
//     .then(function (data) {
//         // displayDrink(...)
//     });
// };

// // getDrink by alcholic 
// var getDrink_A = function (alcho) {
//     var drinkBycatagory = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=' + alcho;
  
//     fetch(drinkBycatagory)
//     .then(function (response) {
//         return response.json();
//     })
//     .then(function (data) {
//         // showdDrink(...)
//     });
// };

// var showDrink = function()
