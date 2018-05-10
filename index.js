const GOOGLE_KEY = "AIzaSyBms29vt_QXtbxYU3J9gN-_dHvxrodu0lc";
const NY_districts_shapes = "https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson";
const NY_neighborhood_names = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";
const NY_crimes = "https://data.cityofnewyork.us/api/views/qgea-i56i/rows.json?accessType=DOWNLOAD";
const NY_housing = "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD";


var map;
var NYCity = {lat:40.7291, lng: -73.9965}
var ManhattanDist = {lat:40.7830361, lng: -73.9713486}
var ManhattanDistMarker;
var BrooklynDist = {lat:40.6781751, lng: -73.9442477}
var BrooklynDistMarker;
var QueensDist = {lat:40.7281979, lng: -73.7950014}
var QueensDistMarker;
var BronxDist = {lat:40.8447766, lng: -73.8649325}
var BronxDistMarker;
var StatenIslandDist = {lat:40.5794788, lng: -74.1503226}
var StatenIslandDistMarker;

var directionsService;
var directionsRenderer;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: NYCity
  });
  ManhattanDistMarker = new google.maps.Marker({
    position: ManhattanDist,
    map: map
  });
  BrooklynDistMarker = new google.maps.Marker({
    position: BrooklynDist,
    map: map
  });
  QueensDistMarker = new google.maps.Marker({
    position: QueensDist,
    map: map
  });
  BronxDistMarker = new google.maps.Marker({
    position: BronxDist,
    map: map
  });
  StatenIslandDistMarker = new google.maps.Marker({
    position: StatenIslandDist,
    map: map
  });
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  getData();
}

function getData(){
  var data,dataRow, FirstCoord, NextCoord, coord, longitud, latitud, color, i;

  data = $.get(NY_districts_shapes, function(){}).done(function(){
    dataRow = data.responseText;
    dataRow = dataRow.split("],[");
    for (var j = 0; j < dataRow.length-1; j++) {
      var polygon = [];
      FirstCoord = dataRow[j].indexOf("[[[");

      //LIMPIANDO LA PRIMERA COORDENADA===========
      coord = dataRow[j].slice(FirstCoord+3,dataRow[j].length);
      coord = coord.split(",");
      longitud = parseFloat(coord[0]);
      latitud = parseFloat(coord[1]);
      polygon.push({lat:latitud,lng:longitud});

      if(j==0){ i=1;
      }else{ i=j+1; }

      for (; dataRow[i].length < 50; i++) {
        coord = dataRow[i].split(",");
        longitud = parseFloat(coord[0]);
        latitud = parseFloat(coord[1]);
        polygon.push({lat:latitud,lng:longitud});
      }
      NextCoord = dataRow[i].indexOf("]]]");
      coord = dataRow[i].slice(0,NextCoord);
      coord = coord.split(",");
      longitud = parseFloat(coord[0]);
      latitud = parseFloat(coord[1]);
      polygon.push({lat:latitud,lng:longitud});
      color = getRandomColor();
      drawPolygon(color,polygon);
      j=i-1;
    }
  })
  .fail(function(error){console.log(error);})
}

function drawPolygon(color,polygon){
  var parking = new google.maps.Polygon({
   paths: polygon,
   strokeColor: color,
   strokeOpacity: 0.8,
   strokeWeight: 2,
   fillColor: color,
   fillOpacity: 0.35
 });
 parking.setMap(map);
}


function getRandomColor() {//Genera los colores aleatorios para drawPolygon
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
