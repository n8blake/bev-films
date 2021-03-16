// function getDrink_name() {
    const searchkey = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","1","2","3","4","6","7","8","9","0"];
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
                    listholder = listholder + data.drinks[j].strDrink + ', ';
                    console.log(listholder)
                    }
                }
        });
    }
// }

// var a = getDrink_name()
// console.log(a)