var socket=io.connect("http://localhost:1000");


function map_display(){
    console.log("Hello");
    function onPositionrecieved(position){
        console.log(position);
        var platform = new H.service.Platform({
            app_id:   '5An0ihXCtCVuGETTN5y9', // to use Google Maps for Work
            app_code: 'bk70IwvqFSHQR4Luc_FroA', 
            });
        
            // Obtain the default map types from the platform object
            var maptypes = platform.createDefaultLayers();
            // Instantiate (and display) a map object:
            var map = new H.Map(
            document.getElementById('mapContainer'),
            maptypes.normal.map,
            {
              zoom: 15,
              center: { lng: position.coords.longitude, lat:position.coords.latitude }
            });
            var ui = H.ui.UI.createDefault(map,maptypes);

            var svgMarkup = '<svg width="24" height="24" ' +
            'xmlns="http://www.w3.org/2000/svg">' +
  '          <rect stroke="white" fill="#1b468d" x="1" y="1" width="22" ' +
            'height="22" /><text x="12" y="18" font-size="12pt" ' +
            'font-family="Arial" font-weight="bold" text-anchor="middle" ' +
            'fill="white">H</text></svg>';

            // Create an icon, an object holding the latitude and longitude, and a marker:
            var icon = new H.map.Icon(svgMarkup),
            coords = { lat:position.coords.latitude,lng: position.coords.longitude},
            marker = new H.map.Marker(coords, {icon: icon});

            // Add the marker to the map and center the map at the location of the marker:
            map.addObject(marker);
            map.setCenter(coords);

            socket.emit('position',{
                user:document.cookie,
                lon: position.coords.longitude,
                lat:position.coords.latitude,
                time:position.timestamp
            })
    }

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onPositionrecieved);
    }
};
map_display();
function display()
{
    
    function onPositionrecieved1(position){
        console.log(position);
                    socket.emit('position',{
                user:document.cookie,
                lon: position.coords.longitude,
                lat:position.coords.latitude,
                time:position.timestamp
            });

    
    }
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onPositionrecieved1);
    }

}
window.setInterval(display,10000);

