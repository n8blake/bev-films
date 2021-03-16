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

function getCategories(pairedDrink) {
    var api_name = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + pairedDrink;
    fetch(api_name)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        for (let i = 0; i < data.drinks.length; i++) {
            // put data to html
            console.log(data.drinks[i].strDrink)
            console.log(data.drinks[i].strInstructions)
            console.log(data.drinks[i].strDrinkThumb)
            var list = data.drinks[i];
            for (let j = 0; j < 15; j++) {
                if (data.drinks[i][obj[j]] !== null){
                    console.log(data.drinks[i][obj[j]])
                    // put data to html
                }else{
                    // put data to html
                }
            }

            for (let j = 0; j < 15; j++) {
                if (data.drinks[i][obj_measure[j]] !== null){
                    console.log(data.drinks[i][obj_measure[j]])
                    // put data to html
                }else{
                    // put data to html
                }
            }
        }
    });
};

// getCategories('margarita')
