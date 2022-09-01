var giphyApiKey = "VuwBgFgeCQ5ydrIwijUqcB8ixpaQBzB0";

//// global vars to reset
var evolutionButtons = [];
// var giphyButtons =[];
////

// var pokeName = "eevee";
var pokeName = "pikachu";
// var pokeName = "tauros";
GetPokemon(pokeName);

var handleFormSubmit = function (event) {
    event.preventDefault();
    var nameInput = $("#input").val();
    if(!nameInput){
        console.log('You need to pick a poke!');
        return;
    }
    // inputTextEl.val("");
    console.log(nameInput);
    nameInput = nameInput.toLowerCase();
    pokeName = nameInput;
    GetPokemon(nameInput);    
};
$("#searchPoke").on('click', handleFormSubmit);

//evolution button clicker
function EvoClick(event){
    event.preventDefault();
    var newTarget = $(event.target);
    // console.log("" + newTarget.html());
    var tempName = newTarget.attr('data-id');
    tempName = tempName;
    // console.log("" + tempName);
    $("#input").val(tempName);
    handleFormSubmit(event);
    // GetWeather(tempName); 
}
$(".evolution-buttons").on('click', '.btn', EvoClick);

function GetPokemon(searchName){
    var requestUrl = `https://pokeapi.co/api/v2/pokemon/${searchName}`;

    var toJSon = function(response){
        return response.json();
    }

    fetch(requestUrl)
    .then(toJSon)
      .then(function (data) {
        console.log(data);
        // DeleteButtons();
        GetSpecies(data.id);

        var frontSprite = data.sprites.other.home.front_default;
        console.log(frontSprite);

        // sprites.other.home.front_default

        $(".img-thumbnail").attr("src", frontSprite);
        $(".img-thumbnail").attr("alt", "" + pokeName + " alt image" );
        
        GetGiphys();
    });
}

function GetGiphys(){
    var giphySearchName = "" + pokeName + " Pokemon";
    giphyUrl = `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${giphySearchName}&limit=5`;
        fetch(giphyUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function (data){
            console.log(data);
            //generate giphys
            $(".giphy-corral").empty();
        for(var i = 0; i < data.data.length; i++){
            var newGiphyCol = $(`<div class="col-2 col-md" style="margin-top:10px"></div>`);
            // console.log('here');
            var newGiphyImg = $('<img src="" class="w-100" style="margin-top:10px"/>');
            var NewSprite = data.data[i].images.original.url;
            console.log(NewSprite);
            newGiphyImg.attr("src", NewSprite);

            $(newGiphyCol).append($(newGiphyImg));
            $(".giphy-corral").append($(newGiphyCol));

        }
    });
}

function GetSpecies(newId){

    var toJSon = function(response){
        return response.json();
    }
    getPokeSpecies = `https://pokeapi.co/api/v2/pokemon-species/${newId}`;
    fetch(getPokeSpecies)
    .then(toJSon)
    .then(function (data){
        console.log(data);
        GetEvolutionChain(data.evolution_chain.url);
        //flavor text
        // console.log("" + data.flavor_text_entries[0].flavor_text);
    });

}

function GetEvolutionChain(newUrl){

    var toJSon = function(response){
        return response.json();
    }

    getPokeEvo = `${newUrl}`;
    fetch(getPokeEvo)
    .then(toJSon)
    .then(function (data){
        console.log(data);
        DeleteEvoButtons();
        // if(data.chain.evolves_to.length === 0){console.log("DOES NOT EVOLVE");return;}
        ShowEvolutions(data.chain);
    });
}

function ShowEvolutions(chain){
    // var 
    // console.log("CHAIN" + chain);
    var speciesNameArray = []; 
    // if(chain.species.name == pokeName){console.log("BASE OF EVOLUTION");}
    // if(chain.species.name != pokeName){console.log("NOT BASE");}
    speciesNameArray.push(chain.species.name);
    for(var thingy in chain.species.evolves_to){
        speciesNameArray.push(thingy.species.name);
    }
    for(var i = 0; i < chain.evolves_to.length; i++){
        speciesNameArray.push(chain.evolves_to[i].species.name);
        if(chain.evolves_to[i].evolves_to.length !== 0){
            // console.log("EVOLVES AGAIN");
            for(var j = 0; j < chain.evolves_to[i].evolves_to.length; j++){
                speciesNameArray.push(chain.evolves_to[i].evolves_to[j].species.name);
            }
        }
    }
    var myIndex = 0;
    for(var k = 0; k < speciesNameArray.length; k++){
        if(speciesNameArray[k] == pokeName){
            // console.log("" + pokeName + " IS NUMBER " + k + " IN ARRAY");
            myIndex = k;
        }
    }
    for(var z = 0; z < speciesNameArray.length; z++){
        var newName = speciesNameArray[z].charAt(0).toUpperCase() + speciesNameArray[z].slice(1);
        speciesNameArray[z] = newName;
    }


    console.log("SPECIES NAME ARRAY " + speciesNameArray);
    // pokeName = pokeName.charAt(0).toUpperCase() + pokeName.slice(1);
        speciesNameArray[z] = newName;
    $(".current-name").html("" + speciesNameArray[myIndex]);
    MakeEvoButtons(speciesNameArray, myIndex)
    // DeleteButtons(speciesNameArray, myIndex);

}

function MakeEvoButtons(speciesNameArray, myIndex){
    for(var i = 0; i < speciesNameArray.length -1; i++){
        if(i === myIndex){continue;}
        var superlative = "";
        if(i < myIndex){superlative = "Evolves From: ";}
        if(i > myIndex){superlative = "Evolves To: ";}
    var newButton = $(".evolution-buttons").append(`<button class="btn btn-info btn-entry text-white" style="margin-top:10px" data-id="${speciesNameArray[i]}">${"" + superlative + speciesNameArray[i]}</button>`);
    newButton.css("margin-top", "10px");
    evolutionButtons.push(newButton);
    console.log(evolutionButtons);
    }
}

function DeleteEvoButtons(){
    $(".evolution-buttons").empty();
    evolutionButtons = [];
    // MakeEvoButtons(speciesNameArray, myIndex)
}

$(document).ready(function(){
    $('.dropdown-toggle').dropdown();
});
// function GenerateButton(newID, newName){
//     console.log("to append: " + newID + " " + newName);
//     $(".saved-locations").css("display","block");
//     var newButton = $(".saved-buttons").append(`<button class="btn btn-info btn-entry w-100" style="margin-top:10px" data-id="${newID}">${newName}</button>`);
//     newButton.css("margin-top", "10px");
//     generateButtons.push(newButton);
// }