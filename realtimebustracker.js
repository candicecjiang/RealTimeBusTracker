
mapboxgl.accessToken = '// Your token goes here';

// This is the map instance
let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-71.104081, 42.3513],
  zoom: 13.2,
});

// Create a marker for the start stop - Nubian Station
let startMarker = new mapboxgl.Marker();
startMarker.setLngLat([-71.0842, 42.3292]);
startMarker.addTo(map);

// Create a marker for the end stop - Harvard Square
let endMarker = new mapboxgl.Marker();
endMarker.setLngLat([-71.1193, 42.3734]);
endMarker.addTo(map);

// Import real-time data from MBTA
async function getBusLocation() {
  const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
  const responce = await fetch(url);
  const json = await responce.json();
  let buses = json.data;
  console.log(buses);
  let info = buses[0].attributes;

  let latitude = info.latitude;
  let longitude = info.longitude;
  let location = [longitude, latitude];

  return location;
}

async function move() {
  // TODO: move the marker on the map every 1000ms. Use the function marker.setLngLat() to update the marker coordinates
  // Use counter to access bus stops in the array busStops
  // Make sure you call move() after you increment the counter.
  const location = await getBusLocation();
  console.log(new Date());
  let marker = new mapboxgl.Marker();
  marker.setLngLat(location);
  marker.addTo(map);

  setTimeout(() => {
    marker.remove();
    move();
    
  }, 10000);
}

move();

// Do not edit code past this point
if (typeof module !== 'undefined') {
  module.exports = { move };
}
