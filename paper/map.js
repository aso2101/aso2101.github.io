var LeafIcon = L.Icon.extend({ options: { iconSize: [15, 15] }});

function drawMap(id,data,center,zoom,markers) {
  L.mapbox.accessToken = 'pk.eyJ1IjoiYXNvMjEwMSIsImEiOiJwRGcyeGJBIn0.jbSN_ypYYjlAZJgd4HqDGQ';
  var map = L.mapbox.map(id, 'aso2101.kbbp2nnh')
        .setView(center, zoom);
  map.createPane("tooltipPane");
  var myLayer = L.mapbox.featureLayer().addTo(map);
  myLayer.on('layeradd', function(e) {
    var marker = e.layer,
        feature = marker.feature,
        circle = new LeafIcon({
          iconUrl: 'images/circle-11.svg'
        }),
        popupContent =  '<a href="#' + feature.properties.name + '">' + feature.properties.name + '</a>';
        if (markers == 'markers') {
            if (feature.properties.name == "Sannati" || feature.properties.name == "Beḷvāḍigi") {
		marker.bindTooltip(feature.properties.name, {
		    permanent: true, 
		    className: "my-label", 
		    direction: "right",
		    pane: "tooltipPane",
		    offset: [0, 0] 
		});
            }
            else {
		marker.bindTooltip(feature.properties.name, {
		    permanent: true, 
		    className: "my-label", 
		    direction: "left",
		    pane: "tooltipPane",
		    offset: [0, 0] 
		});
            }
	};
        marker.setIcon(circle);
        marker.bindPopup(popupContent);
      });
      myLayer.setGeoJSON(data);
};

/ * DATA VARIABLES */
var pratisthana = {  
   "type":"FeatureCollection",
   "features":[  
      {  
         "type":"Feature",
         "geometry":{  
            "place":"Pratiṣṭhāṇa",
            "type":"Point",
            "coordinates":[  
	       75.383882,
	       19.478997
            ]
         },
         "properties":{  
            "name":"Pratiṣṭhāṇa",
            "description":"Pratiṣṭhāṇa",
            "marker-size":"large",
            "marker-color":"#A80000"
         }
      }
   ]
};


/ * DATA VARIABLES */
var saptagodavari = {  
   "type":"FeatureCollection",
   "features":[  
      {  
         "type":"Feature",
         "geometry":{  
            "place":"Pratiṣṭhāṇa",
            "type":"Point",
            "coordinates":[  
	       75.383882,
	       19.478997
            ]
         },
         "properties":{  
            "name":"Pratiṣṭhāṇa",
            "description":"Pratiṣṭhāṇa",
            "marker-size":"large",
            "marker-color":"#A80000"
         }
      },
      {  
         "type":"Feature",
         "geometry":{  
            "place":"Saptagodāvarī",
            "type":"Point",
            "coordinates":[  
               82.062647,
               16.791562
            ]
         },
         "properties":{  
            "name":"Saptagodāvarī",
            "description":"Saptagodāvarī",
            "marker-size":"large",
            "marker-color":"#A80000"
         }
      }
   ]
};
