
//variables to hold the links
  let layerDays = ["https://services2.arcgis.com/RQcpPaCpMAXzUI5g/arcgis/rest/services/Final_Map_WFL1/FeatureServer/17",
  "https://services2.arcgis.com/RQcpPaCpMAXzUI5g/arcgis/rest/services/Final_Map_WFL1/FeatureServer/11",
  "https://services2.arcgis.com/RQcpPaCpMAXzUI5g/arcgis/rest/services/Final_Map_WFL1/FeatureServer/14",
  "https://services2.arcgis.com/RQcpPaCpMAXzUI5g/arcgis/rest/services/Final_Map_WFL1/FeatureServer/8"];
  let layerMonths = ["https://services2.arcgis.com/RQcpPaCpMAXzUI5g/arcgis/rest/services/Final_Map_WFL1/FeatureServer/16",
  "https://services2.arcgis.com/RQcpPaCpMAXzUI5g/arcgis/rest/services/Final_Map_WFL1/FeatureServer/10",
  "https://services2.arcgis.com/RQcpPaCpMAXzUI5g/arcgis/rest/services/Final_Map_WFL1/FeatureServer/13",
  "https://services2.arcgis.com/RQcpPaCpMAXzUI5g/arcgis/rest/services/Final_Map_WFL1/FeatureServer/7"];
  let layerYears = ["https://services2.arcgis.com/RQcpPaCpMAXzUI5g/arcgis/rest/services/Final_Map_WFL1/FeatureServer/15",
  "https://services2.arcgis.com/RQcpPaCpMAXzUI5g/arcgis/rest/services/Final_Map_WFL1/FeatureServer/9",
  "https://services2.arcgis.com/RQcpPaCpMAXzUI5g/arcgis/rest/services/Final_Map_WFL1/FeatureServer/12",
  "https://services2.arcgis.com/RQcpPaCpMAXzUI5g/arcgis/rest/services/Final_Map_WFL1/FeatureServer/6"];

  //function that will update the maps based on the select options
  function ChangeMap()
  {
    //get the values when changed in the html
    map = document.querySelector("#baseMapSelect").value;
    layerIndex = parseInt(document.querySelector("#layers").value);
    interval = document.querySelector("#intervals").value;
    let timeSlider = document.querySelector("#timeSlider").innerHTML = "";
    let layerURL;

    //check to see what layer to use based on the interval value
    if(interval == "days")
    {
      layerURL = layerDays[layerIndex];
    }
    else if(interval == "months")
    {
      layerURL = layerMonths[layerIndex];
    }
    else if(interval == "years")
    {
      layerURL = layerYears[layerIndex];
    }

    //Arcgis requires this to make the map, must be set up properly
    require([
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/FeatureLayer",
      "esri/widgets/TimeSlider",
      "esri/widgets/Expand",
      "esri/widgets/Legend",
    ], (Map, MapView, FeatureLayer, TimeSlider, Expand, Legend) => {

      //create a new layer based on the webmap shared online and the option the user selected
      layer = new FeatureLayer({
        url: layerURL
      });

      //create a new map wuth the map and layer the user selected 
      map = new Map({
        basemap: map,
        layers: [layer]
      });

      //set up the view of the map and place it in the view dix so that it actually shows up
      const view = new MapView({
        map: map,
        container: "viewDiv",
        zoom: 7,
        center: [-75, 43]
      });

      // time slider widget initialization
      const timeSlider = new TimeSlider({
        container: "timeSlider",
        view: view,
        timeVisible: true, // show the time stamps on the timeslider
        loop: true
      });

      //the time slide should match the current laryer and it's time step interval which can be 
      //days, months, or years
      view.whenLayerView(layer).then((lv) => {
        console.log(layer.timeInfo.interval);
        timeSlider.fullTimeExtent = layer.timeInfo.fullTimeExtent.expandTo(interval);
        timeSlider.stops = {
          interval: layer.timeInfo.interval
        };
      });

      //create a legend in the left hand corner to displayer the values and what each dot on the map means
      const legend = new Legend({
        view: view
      });
      const legendExpand = new Expand({
        expandIconClass: "esri-icon-legend",
        expandTooltip: "Legend",
        view: view,
        content: legend,
        expanded: false
      });
      view.ui.add(legendExpand, "top-left");
    });
  }

  //when all the html/css is load then call the chamgemap function so that a map will displayer with 
  //the very first selected values in the drop down. The selected options are chosen in the html
  window.onload = function()
  {
    ChangeMap();
  }