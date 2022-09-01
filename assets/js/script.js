var giphyApiKey = "VuwBgFgeCQ5ydrIwijUqcB8ixpaQBzB0";

//// global vars to reset
var evolutionButtons = [];
// var giphyButtons =[];
////
var firstData = "";
var secondData = "";
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

function DropdownClick(event){
    event.preventDefault();
    // console.log("DID THING");  
    var tempName = $(event.target).text();  
    // console.log("" + $(event.target).text());

    $("#input").val(tempName);
    handleFormSubmit(event);
}

$(".dropdown-menu").on('click', '.dropdown-item', DropdownClick);


function GetPokemon(searchName){
    var requestUrl = `https://pokeapi.co/api/v2/pokemon/${searchName}`;

    var toJSon = function(response){
        return response.json();
    }

    fetch(requestUrl)
    .then(toJSon)
      .then(function (data) {
        console.log(data);
        firstData = data;
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
        secondData = data;
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

var toLocalStorage = function(pokeName){
    var savedPoke = JSON.parse(localStorage.getItem('Pokemon')) || [];
    savedPoke.push(pokeName)
    var pokeArray = Array.from(new Set(savedPoke))
    var saved = JSON.stringify(pokeArray);
    localStorage.setItem('Pokemon', saved)
    displayPokeBtn()
};

var displayPokeBtn = function(pokes){

    var pokes = JSON.parse(localStorage.getItem('Pokemon')) || [];
    var showFive = pokes
    if(pokes.length >= 5){
        showFive = pokes.slice(pokes.length-5)

    }
    // var recent = $('.recent')
    // recent.empty()
    // currentWeather.innerHTML= null
    // $(".giphy-corral").empty();
    $(".recents").empty();
    for(var i = showFive.length; i>=0;i--){
        GenerateButton(showFive[i])
    }
//     for(poke of showFive){
//         GenerateButton(poke)
//     }
}
function GenerateButton(newName){
    if(typeof newName ==='undefined'){
        return;
    }
    console.log("to append: "  + " " + newName);
    // $(".saved-locations").css("display","block");
    var newButton = $(".recents").append(`<button class="btn btn-info btn-entry w-100" style="margin-top:10px">${newName}</button>`);
    newButton.css("margin-top", "10px");
    // generateButtons.push(newButton);
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
    displayData()
    toLocalStorage(speciesNameArray[myIndex])
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


function displayData(){
    var type = Capitalizer(firstData.types[0].type.name);
    if(firstData.types.length > 1){
        type = type + " / " + Capitalizer(firstData.types[1].type.name);
    }
    var generation = Capitalizer(secondData.generation.name);
    generation = GenEndFixer(generation);
    if(secondData.habitat){
        var habitat = Capitalizer(secondData.habitat.name);
    }
    var flavorText = secondData.flavor_text_entries[0].flavor_text.replace(/[\f\n]/gm, ' ');
    var abilities = Capitalizer(firstData.abilities[0].ability.name);
    if(firstData.abilities.length > 1){
        abilities = abilities + " / " + Capitalizer(firstData.abilities[1].ability.name);
    }
    $('#type').html(type)
    $('#generation').html(generation)
    $('#habitat').html(habitat)
    $('#abilities').html(abilities)
    $('#flavor-text').html(flavorText)
    
}

function Capitalizer(thingToCapitalize){
    return thingToCapitalize.charAt(0).toUpperCase() + thingToCapitalize.slice(1);
}

function GenEndFixer(genToFix){
    // var firstPart = genToFix.substring(str.indexOf('-') + 1);
    var firstPart = genToFix.split('-')[1];
    var lastPart = firstPart.toUpperCase();
    return "Generation-" + lastPart;
    // return "test";
}

$(document).ready(function(){
    $('.dropdown-toggle').dropdown();
});

//trying to make the enter button work on search 
// Get the input field
var input = document.getElementById("input");

input.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("searchPoke").click();
  }
});

// var toLocalStorage = function(){
//     var savedPoke = JSON.parse(localStorage.getItem('Pokemon')) || [];
//     savedPoke.push(speciesNameArray[myIndex])
//     var pokeArray = Array.from(new Set(savedPoke))
//     var saved = JSON.stringify(pokeArray);
//     console.log(saved)
//     localStorage.setItem('Pokemon', saved)
// };
// }
// function GenerateButton(newID, newName){
//     console.log("to append: " + newID + " " + newName);
//     $(".saved-locations").css("display","block");
//     var newButton = $(".saved-buttons").append(`<button class="btn btn-info btn-entry w-100" style="margin-top:10px" data-id="${newID}">${newName}</button>`);
//     newButton.css("margin-top", "10px");
//     generateButtons.push(newButton);
// }