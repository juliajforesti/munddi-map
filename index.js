// creating the map
let mymap = L.map("map", { zoomControl: false }).setView([-23.53974278720173, -46.72131030304516,], 8);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(mymap);

// array to save created markers
let markers = [];

// array with all points from api
let allPoints = []

// placing zoom controls in bottom right
L.control
  .zoom({
    position: "bottomright",
  })
  .addTo(mymap);

// boudaries
let currentBounds = {
  _northEast: {
    lat: -21,
    lng: -43,
  },
  _southWest: {
    lat: -25,
    lng: -49,
  },
};

// fetching data from endpoint
async function fetchData(bounds) {
  const uri = `https://munddi.com/dev/pdvs?ne_lat=${bounds._northEast.lat}&ne_lng=${bounds._northEast.lng}&sw_lat=${bounds._southWest.lat}&sw_lng=${bounds._southWest.lng}`

  try {
    let response = await (
      await fetch(uri)
    ).json();
    allPoints = response.data
    const points = response.data;
    
    // creating markers and popup text
    createMarkers(points)

    // inserting list items
    createList(points)

  } catch (error) {
    console.error(error);
  }
}
fetchData(currentBounds);
// update boundaries on move
function updateBounds() { 
  currentBounds = {...mymap.getBounds()}
  createButton()
  fetchData(currentBounds)
}
mymap.on('moveend', updateBounds);
mymap.on('zoomend', updateBounds);
mymap.on('resize', updateBounds);


// create markers and popup text
function createMarkers(points){
  return points.map((point) => {
    let marker = L.marker([point.lat, point.lng], {
      title: point.name,
    }).addTo(mymap);
    markers.push(marker);
    marker.bindPopup(`<h5>${point.name} </h5>
    <p>${point.street}</p>
    <p>
      ${point.city} / ${point.uf}
    </p>`);
  });
}

// create list items 
function createList(points){
  const ul = document.querySelector("#list");
  ul.innerHTML = ''
  points.map((point) => {
    const li = document.createElement("li");
    ul.appendChild(li);

    // adding event listener to fly to location and open popup
    li.addEventListener("click", () => {
      mymap.flyTo([point.lat, point.lng], 16);
      const currentMarker = markers.find(
        (item) => item.options.title === point.name
      );
      currentMarker.openPopup();
    });

    // li inner html
    li.innerHTML = `<h5>${point.name.toLowerCase()} </h5>
    <p>${point.street}</p>
    <p>${point.city} / ${point.uf}</p>`;
  });
}

// filter list
function filterList() {
  let input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("searchInput");
  filter = input.value.toLowerCase();
  ul = document.querySelector("ul");
  li = ul.getElementsByTagName("li");
  console.log(li)
  for (i = 0; i < li.length; i++) {
    title = li[i].getElementsByTagName("h5")[0];
    txtValue = title.textContent || title.innerText;
    if (txtValue.toLowerCase().includes(filter)) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

function createButton(){
  let form = document.querySelector('form')

  let button = document.querySelector('button') || document.createElement('button')
  button.addEventListener('click', (e) => resetPage(e))
  button.classList += 'btn btn-light' 
  button.innerText = 'Reset map'
  form.appendChild(button)
}

function resetPage(e){
  e.preventDefault();
  document.location.reload()
  console.log(e)
}

// toggle menu
function toggleMenu() {
  const element = document.getElementById('menu-container')
  element.toggleAttribute('hidden')
}