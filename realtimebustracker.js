mapboxgl.accessToken = 'Your token goes here';

// This is the map instance
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-71.104081, 42.3533],
    zoom: 12.8,
});

// Create a marker for the start stop - Nubian Station
const start = document.createElement('div');
start.className = 'custom-marker';
start.innerHTML = 'Nubian Station';
let startMarker = new mapboxgl.Marker(start)
    .setLngLat([-71.0842, 42.3292])
    .addTo(map);

// Create a marker for the end stop - Harvard Square
const end = document.createElement('div');
end.className = 'custom-marker';
end.innerHTML = 'Harvard Square';
let endMarker = new mapboxgl.Marker(end)
    .setLngLat([-71.1193, 42.3734])
    .addTo(map);

// Import real-time data from MBTA, 
// fetch the location of the first bus in data,
// and mark the bus on the map.
async function getBusData() {
    const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
    const response = await fetch(url);
    const json = await response.json();
    let buses = json.data;
    return buses
}

const create = function(lng, lat) {
    return new mapboxgl.Marker()
                .setLngLat([lng, lat])
                .addTo(map);
}

const update = function(marker, lng, lat) {
    marker.setLngLat([lng, lat]);
}

let busMarkers = {} // an object to keep track of all markers
async function run() {
    let busData = await getBusData();
    let count = busData.length;
    // an object to keep track of which labels are in busData
    let labelsInBusData = {};
    for (let i = 0; i < count; i++) {
        if (busData[i].attributes.current_status == "IN_TRANSIT_TO" && busData[i].attributes.direction_id == 0) {   
            let info = busData[i].attributes;
            let lng = info.longitude;
            let lat = info.latitude;
            let label = info.label;
            if (busMarkers[label]) {
                update(busMarkers[label], lng, lat);
            } else {
                busMarkers[label] = create(lng, lat);
            }
            // Mark the label as seen in busData
            labelsInBusData[label] = true;
        }
    }
    // Iterate through busMarkers to delete markers not in busData
    for (const label in busMarkers) {
        if (!labelsInBusData[label]) {
            // Remove the marker and delete the entry from busMarkers
            busMarkers[label].remove();
            delete busMarkers[label];
        }
    }
}
setInterval(run, 15000);

run();

if (typeof module !== 'undefined') {
  module.exports = { run };
}

