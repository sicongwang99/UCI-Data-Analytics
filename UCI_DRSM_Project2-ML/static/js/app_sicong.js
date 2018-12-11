var indeed= new L.markerClusterGroup();
var glassdoor= new L.markerClusterGroup();


// Define variables for our tile layers
var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});


var street = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
})

// Only one base layer can be shown at a time
var baseMaps = {
  Light: light,
  Dark: dark,
  Street: street
};

// Overlays that may be toggled on or off
var overlayMaps = {
  "Indeed":indeed,
  "Glassdoor":glassdoor
};

var myMap = L.map("map", {
  center: [38.7, -98.95],
  zoom: 4,
  layers: [light, indeed, glassdoor]
});

// Use the list of sample names to populate the select options
  d3.json("/jobs", function(json_data) {

  	  // Loop through data
     for (var i = 0; i < json_data.length; i++) {

        // search the source from indeed
        if (json_data[i].Source === "Indeed") {

            // Set the data location property to a variable
            var Latitude = json_data[i].lat;

            var Longitude = json_data[i].lng;

            // Check for location property
            if (Latitude, Longitude) {

            // Add a new marker to the cluster group and bind a pop-up
                indeed.addLayer(L.marker([Latitude, Longitude])
                    .bindPopup("City: " + json_data[i].City +
                        "<br> Title: " + json_data[i].Title +
                        "<br> Designations: " + json_data[i].Designation +
                        "<br> Company: " + json_data[i].Company
                    )
                );
            }
        }
     }
      myMap.addLayer(indeed);

  	  // Loop through data
      for (var i = 0; i < json_data.length; i++) {

            // search the source from glassdoor
            if (json_data[i].Source === "Glassdoor") {

                // Set the data location property to a variable
                var Latitude = json_data[i].lat;

                var Longitude = json_data[i].lng;

                // Check for location property
                if (Latitude, Longitude) {

                    // Add a new marker to the cluster group and bind a pop-up
                    glassdoor.addLayer(L.marker([Latitude, Longitude])
                        .bindPopup("City: " + json_data[i].City +
                            "<br> Title: " + json_data[i].Title +
                            "<br> Designations: " + json_data[i].Designation +
                            "<br> Company: " + json_data[i].Company
                        )
                    );
                }
            }
      }
      myMap.addLayer(glassdoor);

  });

L.control.layers(baseMaps, overlayMaps, {collapsed: false }).addTo(myMap);
