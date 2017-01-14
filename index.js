const target_distance = 5;

document.querySelector('#gpx_file_input').addEventListener('change', event => {
  // Read the GPX from the file into an XML tree
  read_gpx(event.target.files[0]).then(gpx => {
    // Using the toGeoJSON library, convert it to geoJSON
    const geoJSON = toGeoJSON.gpx(gpx).features[0];

    // Extract useful data from the geoJSON
    const coordinate_times = geoJSON.properties.coordTimes;
    const coordinates = geoJSON.geometry.coordinates;

    // Zip the coordinate times and the coordinates together
    const points = coordinate_times.map((time, i) => {
      return {
        time: new Date(time),
        latitude: coordinates[i][1],
        longitude: coordinates[i][0]
      };
    });

    // Find the difference between each point
    const legs = [];
    points.forEach((point, i) => {
      if (points[i+1])
        legs.push({
          time: (points[i+1].time-point.time)/1000, // for seconds
          distance: distance(point, points[i+1])
        });
    });

    const time = process_legs(legs);
    document.querySelector('#result').innerHTML = seconds_to_minutes(time);
  });
});

function read_gpx(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = event => {
      console.log(event.target.result);
      resolve((new DOMParser()).parseFromString(event.target.result, 'text/xml'));
    };
    reader.readAsText(file);
  });
}

function process_legs(legs) {
  const leg_cache = [];
  let best_distance_estimate = 0;
  let fastest_time = 0;
  legs.forEach(leg => {
    leg_cache.push(leg);
    best_distance_estimate += leg.distance;

    // See if legs can be popped from the head without getting shorter than target_distance and update
    while(best_distance_estimate-leg_cache[0].distance > target_distance)
      best_distance_estimate -= leg_cache.shift().distance;

    // See if this time is fastest
    if(best_distance_estimate > target_distance) {
      const time = measureTime(leg_cache);
      if (!fastest_time || time < fastest_time) fastest_time = time;
    }
  });
  console.log('Best estimate of', target_distance, 'was', best_distance_estimate);
  return fastest_time;
}

// Count how long a set of legs took
function measureTime(legs) {
  return legs.reduce((time, leg) => time + leg.time, 0);
}

function seconds_to_minutes(time) {
  const minutes = Math.floor(time/60);
  const seconds = time - minutes*60;
  return `${minutes}:${seconds}`;
}

// Distance between two geographical coordinates
function distance(pointA, pointB) {
  const R = 6371; // km
  const delta_latitude = (pointB.latitude-pointA.latitude) * Math.PI / 180;
  const delta_longitude = (pointB.longitude-pointA.longitude) * Math.PI / 180;
  const a = Math.sin(delta_latitude/2) * Math.sin(delta_latitude/2) +
    Math.cos(pointA.latitude * Math.PI / 180 ) * Math.cos(pointB.latitude * Math.PI / 180 ) *
    Math.sin(delta_longitude/2) * Math.sin(delta_longitude/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}
