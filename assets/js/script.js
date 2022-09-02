var giphyApiKey = "VuwBgFgeCQ5ydrIwijUqcB8ixpaQBzB0";

var evolutionButtons = [];

var firstData = "";
var secondData = "";

var pokeName = "pikachu";
function OnPageLoad(){
    var savedPoke = JSON.parse(localStorage.getItem('Pokemon')) || [];
    console.log("" + savedPoke);
        if(savedPoke.length > 0){
            pokeName = savedPoke[savedPoke.length -1].toLowerCase();
            $("#input").val(Capitalizer(pokeName));
        }
        GetPokemon(pokeName);
    }

OnPageLoad();

var handleFormSubmit = function (event) {
    event.preventDefault();
    var nameInput = $("#input").val();
    if(!nameInput){
        console.log('You need to pick a poke!');
        return;
    }
    console.log(nameInput);
    nameInput = nameInput.toLowerCase();
    pokeName = nameInput;
    GetPokemon(nameInput);    
}
$(".searchPoke").on('click', handleFormSubmit);

// Evolution Button Clicker
function EvoClick(event){
    event.preventDefault();
    var newTarget = $(event.target);
    var tempName = newTarget.attr('data-id');
    tempName = tempName;
    $("#input").val(tempName);
    handleFormSubmit(event);
}
$(".evolution-buttons").on('click', '.btn', EvoClick);

function DropdownClick(event){
    event.preventDefault();
    var tempName = $(event.target).text();  
    $("#input").val(tempName);
    handleFormSubmit(event);
};

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

        $(".img-thumbnail").attr("src", frontSprite);
        $(".img-thumbnail").attr("alt", "" + pokeName + " alt image" );
        
        GetGiphys();
    });
};

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
            var newGiphyCol = $(`<div class="col-lg-2 col-sm-6" style="margin-top:10px"></div>`);
            var newGiphyImg = $('<img src="" class="w-100 gImg" style="margin-top:10px"/>');
            newGiphyImg.attr("href", data.data[i].bitly_gif_url);
            var NewSprite = data.data[i].images.original.url;
            console.log(NewSprite);
            newGiphyImg.attr("src", NewSprite);

            $(newGiphyCol).append($(newGiphyImg));
            $(".giphy-corral").append($(newGiphyCol));

        }
    });
};

function GiphyClick(event){
    event.preventDefault();
    var newLink =  $(event.target).attr('href');
    window.open(newLink, '_blank'); 
}

$(document).on('click', '.gImg', GiphyClick);

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
    });
};

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
        ShowEvolutions(data.chain);
    });
}

var toLocalStorage = function(pokeName){
    // console.log("ADDING TO ARRAY");
    var savedPoke = JSON.parse(localStorage.getItem('Pokemon')) || [];
    savedPoke.push(pokeName)
    var pokeArray = Array.from(new Set(savedPoke))
    var saved = JSON.stringify(pokeArray);
    localStorage.setItem('Pokemon', saved);
    displayPokeBtn();
};

var displayPokeBtn = function(pokes){

    var pokes = JSON.parse(localStorage.getItem('Pokemon')) || [];
    var showFive = pokes;
    var indexOfClicked = pokes.indexOf(Capitalizer(pokeName), 0);
    pokes.push(pokes.splice(indexOfClicked, 1)[0]);
    // if(showFive.in)
    if(pokes.length >= 5){
        showFive = pokes.slice(pokes.length-5);
        // takes old pokes out of array
        
        var pokeArray = Array.from(new Set(showFive))
        var saved = JSON.stringify(pokeArray);
        localStorage.setItem('Pokemon', saved);
        //
    }

    $(".recents").empty();
    for(var i = showFive.length; i>=0;i--){
        GenerateButton(showFive[i]);
    }

}
function GenerateButton(newName){
    if(typeof newName ==='undefined'){
        return;
    }
    var newButton = $(".recents").append(`<button class="btn btn-outline-dark text-white btn-primary btn-entry w-100" style="margin-top: 10px">${newName}</button>`);
}

function ShowEvolutions(chain){
    var speciesNameArray = []; 
    speciesNameArray.push(chain.species.name);
    for(var thingy in chain.species.evolves_to){
        speciesNameArray.push(thingy.species.name);
    }
    for(var i = 0; i < chain.evolves_to.length; i++){
        speciesNameArray.push(chain.evolves_to[i].species.name);
        if(chain.evolves_to[i].evolves_to.length !== 0){
            for(var j = 0; j < chain.evolves_to[i].evolves_to.length; j++){
                speciesNameArray.push(chain.evolves_to[i].evolves_to[j].species.name);
            }
        }
    }
    var myIndex = 0;
    for(var k = 0; k < speciesNameArray.length; k++){
        if(speciesNameArray[k] == pokeName){
            myIndex = k;
        }
    }
    for(var z = 0; z < speciesNameArray.length; z++){
        var newName = speciesNameArray[z].charAt(0).toUpperCase() + speciesNameArray[z].slice(1);
        speciesNameArray[z] = newName;
    }


    console.log("SPECIES NAME ARRAY " + speciesNameArray);
        speciesNameArray[z] = newName;
    $(".current-name").html("" + speciesNameArray[myIndex]);
    MakeEvoButtons(speciesNameArray, myIndex)
    displayData()
    toLocalStorage(speciesNameArray[myIndex])
}

function MakeEvoButtons(speciesNameArray, myIndex){
    for(var i = 0; i < speciesNameArray.length -1; i++){
        if(i === myIndex){continue;}
        var superlative = "";
        if(i < myIndex){superlative = "Evolves From: ";}
        if(i > myIndex){superlative = "Evolves To: ";}
    var newButton = $(".evolution-buttons").append(`<button class="btn btn-outline-dark btn-danger btn-entry text-white" style="margin-top:10px " data-id="${speciesNameArray[i]}">${"" + superlative + speciesNameArray[i]}</button>`);
    newButton.css("margin-top", "10px");
    evolutionButtons.push(newButton);
    console.log(evolutionButtons);
    }
}

function DeleteEvoButtons(){
    $(".evolution-buttons").empty();
    evolutionButtons = [];
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
    var flavorText = GetFlavorText();
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
    var firstPart = genToFix.split('-')[1];
    var lastPart = firstPart.toUpperCase();
    return "Generation-" + lastPart;
}

function GetFlavorText(){
    // var newString = secondData.flavor_text_entries[0].flavor_text; 
    var newString = ""; 
    var flavCounter = 0;
    var usedArray = [];
    while(flavCounter < 3){
       var getRand = Math.floor(Math.random()*secondData.flavor_text_entries.length);
        
        if(secondData.flavor_text_entries[getRand].language.name === 'en'){
            if(usedArray.includes(secondData.flavor_text_entries[getRand].flavor_text.toLowerCase().replace(/[\f\n]/gm, ' '))){continue;}
            var brThing = "<br><br>";
            if(flavCounter == 0){brThing = "";}
            newString = newString + brThing + secondData.flavor_text_entries[getRand].flavor_text;
            usedArray.push(secondData.flavor_text_entries[getRand].flavor_text.toLowerCase().replace(/[\f\n]/gm, ' '));
            flavCounter += 1;
        }
    }
    console.log("" + usedArray);
    return newString.replace(/[\f\n]/gm, ' ');
}

$(document).ready(function(){
    $('.dropdown-toggle').dropdown();
});

function ListItemClick(event){
    event.preventDefault();
    var newTarget = $(event.target);
    console.log("" + newTarget.html());
    var tempName = newTarget.html();
    $("#input").val(tempName);
    handleFormSubmit(event); 
}
$(".recents").on('click', '.btn', ListItemClick);

// var input = document.getElementById("input");

// input.addEventListener("keypress", function(event) {
//   if (event.key === "Enter") {
//     event.preventDefault();
//     document.getElementsById("searchPoke").click();
//   }
// });