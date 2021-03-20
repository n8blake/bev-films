var testEl = document.querySelector('#test')

var ingredientlist = [];
var obj = {};

for (let i = 0; i < 15; i++) {
    ingredientlist[i] = "strIngredient"+(i+1);
    obj[i] = ingredientlist[i]
}

const searchkey = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","1","2","3","4","6","7","8","9","0"];
const searchkey1 = ["a"];

    var listholder = [];
    for (let i = 0; i < searchkey.length; i++) {
        var drinkBycatagory = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?f=' + searchkey[i];    
        fetch(drinkBycatagory)
        .then(function (response) {
        return response.json();
        })
        .then(function (data) {
                if (data.drinks === null) {
                    return listholder;
                } else {
                    for (let j = 0; j < data.drinks.length; j++) {
                        for (let k = 0; k < 15; k++) {
                            if (data.drinks[j][obj[k]] !== null){
                            listholder = listholder + data.drinks[j][obj[k]] + ',';
                            var list = listholder.split(',');
                            var sort = [...new Set(list)];
                            testEl.textContent = sort;
                            }
                        }
                    }
                }      
        });
    }

