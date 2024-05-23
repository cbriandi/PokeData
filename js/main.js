//class for local storage
class Pokemon {
  constructor(name, cries, image, height, weight, abilities, type, description) {
      this.name = name;
      this.cries = cries;
      this.image = image;
      this.height = height;
      this.weight = weight;
      this.abilities = abilities;
      this.type = type;
      this.description = description;
  }
}

document.querySelector('button').addEventListener('click', () => {
  const pokemon = document.querySelector('input').value.toLowerCase();
  if (localStorage.getItem(pokemon)) {
      console.log(`${pokemon} is in storage!`);
      displayInfoFromLocalStorage(getFromLocal(pokemon));
  } else {
      console.log(`not in storage, fetching from API`);
      const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
      getFetch(url, pokemon);
  }
});

function getFetch(url, pokemon) {
  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data);
          return fetchDescription(data.species.url)
              .then(description => {
                  displayInfoFromFetch(data, description);
                  const name = pokemon;
                  const cries = data.cries;
                  const image = data.sprites.other.showdown.front_default ? data.sprites.other.showdown.front_default : data.sprites.other.home.front_default;
                  // const image = data.sprites.other.dream_world.front_default !== null ? data.sprites.other.dream_world.front_default : data.sprites.other.home.front_default;
                  const height = data.height;
                  const weight = data.weight;
                  const abilities = data.abilities;
                  const type = data.types;
                  const pokemonObj = new Pokemon(name, cries, image, height, weight, abilities, type, description);
                  const pokemonJSON = JSON.stringify(pokemonObj);
                  localStorage.setItem(pokemon, pokemonJSON);
              })
              .catch(err => {
                  console.log(`error ${err}`);
              });
      })
      .catch(err => {
          console.log(`error ${err}`);
      });
}

function fetchDescription(url) {
  return fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
          const desc = data.flavor_text_entries[0].flavor_text.replaceAll('\n', ' ').replaceAll('\f', ' ');
          return desc;
      })
      .catch(err => {
          console.log(`error ${err}`);
      });
}

function getFromLocal(pokemon) {
  const pokemonJSON = localStorage.getItem(pokemon);
  try {
      const pokemon = JSON.parse(pokemonJSON);
      return pokemon;
  } catch (error) {
      console.error('Error parsing JSON from localStorage:', error);
      return null;
  }
}

function displayInfoFromFetch(data, description) {
  console.log(data);
  if (data.cries.legacy !== null) {
      playAudio(data.cries.legacy);
  } else {
      playAudio(data.cries.latest);
  }
  document.querySelector('h2').innerText = data.name[0].toUpperCase() + data.name.slice(1);
  // document.querySelector('img').src = data.sprites.other.dream_world.front_default !== null ? data.sprites.other.dream_world.front_default : data.sprites.other.home.front_default;
  document.querySelector('img').src = data.sprites.other.showdown.front_default ? data.sprites.other.showdown.front_default : data.sprites.other.home.front_default;
  document.getElementById('height').innerText = convertHeight(data.height);
  document.getElementById('weight').innerText = convertWeight(data.weight);
  document.getElementById('abilities').innerText = getAbilities(data.abilities);
  document.getElementById('type').innerText = getType(data.types);
  document.getElementById('description').innerText = description;
}

function displayInfoFromLocalStorage(data) {
  displayLocalStorageItemSize(data.name);
  console.log(data);
  if (data.cries.legacy !== null) {
      playAudio(data.cries.legacy);
  } else {
      playAudio(data.cries.latest);
  }
  document.querySelector('h2').innerText = data.name[0].toUpperCase() + data.name.slice(1);
  document.querySelector('img').src = data.image;
  document.getElementById('height').innerText = convertHeight(data.height);
  document.getElementById('weight').innerText = convertWeight(data.weight);
  document.getElementById('abilities').innerText = getAbilities(data.abilities);
  document.getElementById('type').innerText = getType(data.type);
  document.getElementById('description').innerText = data.description;
}

// Function to display the size of an item in localStorage
function displayLocalStorageItemSize(key) {
  const item = localStorage.getItem(key);
  if (item) {
      const sizeInBytes = new TextEncoder().encode(item).length;
      const sizeInKB = sizeInBytes / 1024;
      console.log(`Size of '${key}' in localStorage: ${sizeInBytes} bytes (${sizeInKB.toFixed(2)} KB)`);
  } else {
      console.error(`Item '${key}' not found in localStorage`);
  }
}

// Convert height from decimetres to feet and inches (feet' inches")
function convertHeight(deci) {
  if (deci) {
      document.querySelector('.height').classList.remove('hidden');
  } else {
      document.querySelector('.weight').classList.add('hidden');
  }
  let inches = deci * 3.93701;
  let feet = Math.floor(inches / 12);
  inches = Math.round(inches % 12);
  if (inches == 12) {
      inches = 0;
      feet++;
  }
  let strInches = inches < 10 ? `0${inches}` : `${inches}`;
  return `${feet}' ${strInches}"`;
}

// Convert weight from hectograms to lbs
function convertWeight(hecto) {
  if (hecto) {
      document.querySelector('.weight').classList.remove('hidden');
  } else {
      document.querySelector('.weight').classList.add('hidden');
  }
  return `${(hecto / 4.536).toFixed(1)} lbs`;
}

function getAbilities(abilities) {
  if (abilities) {
      document.querySelector('.abilities').classList.remove('hidden');
  } else {
      document.querySelector('.abilities').classList.add('hidden');
  }
  return abilities.map(x => x.ability.name).join(', ');
}

function getType(types) {
  if (types) {
      document.querySelector('.type').classList.remove('hidden');
  } else {
      document.querySelector('.type').classList.add('hidden');
  }
  return types.map(x => x.type.name).join(', ');
}

function playAudio(file) {
  let audio = new Audio(file);
  audio.volume = 0.02;
  audio.play();
}