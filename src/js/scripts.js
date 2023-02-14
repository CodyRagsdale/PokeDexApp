let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=251";
  let currentIndex = 0;

    // Returns the complete pokemon array
    function getAll() {
        return pokemonList;
    }

    // Adds a pokemon object to the array
    function add(pokemon) {
        if (typeof pokemon === "object" && "name" in pokemon && "detailsUrl" in pokemon) {
            pokemonList.push(pokemon);
        }
    }


    // Adds a button with the pokemon's name to the website and attaches an event listener that calls the showDetails function on click
    function addListItem(pokemon, index) {
        let pokemonListUl = $(".pokemon-list");
        let listItem = $('<li class="group-list-item"></li>');
        let button = $(`<button type="button" class="pokemon-button btn btn-primary" 
            data-toggle="modal" data-target="#pokeModal">${pokemon.name}</button>`);


        listItem.append(button);
        pokemonListUl.append(listItem);

      button.on("click", function () {
        currentIndex = pokemonList.indexOf(pokemon);
            showDetails(pokemon);
        });
  }
  
  // Event Handlers for the Prev/Next buttons in the modal
  $(document).ready(function () {
  $(".modal-arrow-left").click(function() {
    goToPreviousPokemon();
  });
  });
  
  $(document).ready(function () {
    $(".modal-arrow-right").click(function () {
      goToNextPokemon();
    });
  });

  // Functions to go to Prev/Next pokemon modal 
  function goToPreviousPokemon() {
    currentIndex = (currentIndex - 1 + pokemonList.length) % pokemonList.length;
    $(".modal-title").empty();
    $(".modal-body").empty();
    showDetails(pokemonList[currentIndex]);
  }
  
  function goToNextPokemon() {
    currentIndex = (currentIndex + 1 + pokemonList.length) % pokemonList.length;
    $(".modal-title").empty();
    $(".modal-body").empty();
    showDetails(pokemonList[currentIndex]);
}


    // Displays the details of a specific pokemon using the details retrieved from the API
  function showDetails(pokemon) {
        loadDetails(pokemon).then(function() {
            showModal(pokemon, currentIndex);
        });
    }

    function loadList() {
        return fetch(apiUrl).then(function (response) {
            return response.json();
        }).then(function (json) {
            json.results.forEach(function (item) {
                let pokemon = {
                    name: item.name,
                    detailsUrl: item.url
                };
                add(pokemon);
            });
        }).catch(function (e) {
            console.error(e);
        })
    }
    // Adds details to a specific pokemon object in the array 
    function loadDetails(item) {
        let url = item.detailsUrl;
        return fetch(url).then(function(response) {
            return response.json();
        }).then(function(details) {
            item.imageUrl = details.sprites.front_default;
            item.imageUrlBack = details.sprites.back_default;
            item.height = details.height;
            item.types = details.types;
            item.weight = details.weight;
        }).catch(function(e) {
            console.error(e);
        });
    }


    // This function shows a modal with the pokemon details
    function showModal(pokemon) {
        let types = "";
        pokemon.types.forEach(function(type) {
            types += type.type.name + " ";
        });

        let modalTitle = $(".modal-title");
        let modalBody = $(".modal-body");

        modalTitle.empty();
        modalBody.empty();

        modalTitle.append(pokemon.name);
        modalBody.append(`<img class="modal-img" src="${pokemon.imageUrl}">`);
        modalBody.append(`<img class="modal-img" src="${pokemon.imageUrlBack}">`);
        modalBody.append(`<p>Height: ${pokemon.height}</p>`);
        modalBody.append(`<p>Weight: ${pokemon.weight}</p>`);
        modalBody.append(`<p>Types: ${types}</p>`);
    }


    // Load Pokemons from the API and print each pokemon on the website
    function loadAll() {
        loadList().then(function() {
            getAll().forEach(function(pokemon) {
                addListItem(pokemon);
            });
        });
  }
  
function search(searchInput) {
  let searchResults = pokemonList.filter(function(pokemon) {
    return pokemon.name.toUpperCase().includes(searchInput.toUpperCase());
  });
  displaySearchResults(searchResults);
}

function displaySearchResults(searchResults) {
  $('.pokemon-list').empty();
  searchResults.forEach(function(pokemon) {
    addListItem(pokemon);
  });
}
  
  $(document).ready(function () {
      $("#search-input").on("keypress", function (event) {
        if (event.which === 13) {
          event.preventDefault();
      let searchInput = $("#search-input").val().toUpperCase();
      pokemonRepository.search(searchInput);
    }
    });
    $("#search-button").click(function () {
    let searchInput = $("#search-input").val().toUpperCase();
    pokemonRepository.search(searchInput);
    });
  });
  
  $(document).ready(function () {
    $("#clear-button").click(function () {
      $("#search-input").val("");
      pokemonRepository.displaySearchResults(pokemonRepository.getAll());
  });
});

    // Return object with the same names for keys as values
    return {
        getAll: getAll,
        add: add,
        addListItem: addListItem,
        goToPreviousPokemon: goToPreviousPokemon,
        goToNextPokemon: goToNextPokemon,
        loadList: loadList,
        loadDetails: loadDetails,
        showDetails: showDetails,
        showModal: showModal,
        search: search,
        displaySearchResults: displaySearchResults,
        loadAll: loadAll
    };
})();

pokemonRepository.loadAll();