var giphyApiKey = "VuwBgFgeCQ5ydrIwijUqcB8ixpaQBzB0";



// https://pokeapi.co/api/v2/pokemon/pikachu
// https://api.giphy.com/v1/gifs/search?api_key=VuwBgFgeCQ5ydrIwijUqcB8ixpaQBzB0&q=pikachu&limit=5

GetPokemon('pikachu');

function GetPokemon(searchName){
    var requestUrl = `https://pokeapi.co/api/v2/pokemon/${searchName}`;

     var toJSon = function(response){
         return response.json();
     }

    fetch(requestUrl)
    .then(toJSon)
      .then(function (data) {
        console.log(data);

        var pokeName = data.forms[0].name;
        console.log("" + pokeName);

        giphyUrl = `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${pokeName}&limit=5`;
        fetch(giphyUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function (data){
            console.log(data);
        });
    });
}