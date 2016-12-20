
// Set campus names as object
var campus_list = new Object();
// Set different facilities in Leppavaara as object
var list_lep = new Object(); 
var text_lep = new Object();
list_lep['library'] = ['Vanha maantie 3', 'Address: Vanha maantie 3', '1st floor, B wing'];
list_lep['restaurant'] = ['Vanha maantie 3', 'Address: Vanha maantie 3', '1st floor, at the main entrance'];
list_lep['wc'] = ['Vanha maantie 3', 'Address: Vanha maantie 3', 'Room: B103, B119, B132, B133, B134, B149, B150, B206, B217, B218, B229, B230'];

// Set different facilities in Bulevardi as object
var list_bul = new Object();
var text_bul = new Object();
list_bul['library'] = ['Bulevardi 31', 'Address: Bulevardi 31', 'A building, 4th floor'];
list_bul['restaurant'] = ['Bulevardi 31' , 'Address: Bulevardi 31', 'B building, 2nd floor'];
list_bul['wc'] = ['Bulevardi 31', 'Address: Bulevardi 31', 'Room A102, 103']; 

campus_list['Leppavaara'] = list_lep;
campus_list['Bulevardi'] = list_bul;
	// Insert place address as text to address description on the right side of page
    function set_text(campus, place){
    	console.log("tawedfasd");
    	document.getElementById('description').innerHTML = campus_list[campus][place][1] + '<br>' + campus_list[campus][place][2] ;

    }

    // Convert selection from selection list to value
    function get_address() {
		var campus =  document.getElementById("campus").value;
		var place = document.getElementById("place").value;
		var address = campus_list[campus][place][0];
		set_text(campus, place);
		return address;
    }

    // Google map API
    function get_json(address){
		var xmlHttp = null;
		xmlHttp = new XMLHttpRequest();
		url = "https://maps.googleapis.com/maps/api/geocode/json?address="+get_address()+"&sensor=true_or_false"
		xmlHttp.open( "GET", url, false );
		xmlHttp.send( null );
		return xmlHttp.responseText;
    }

	function get_position(){
		var json = get_json(get_address());
		var obj = JSON.parse(json);
		if (obj['status'] == "OK"){
			var lat = obj['results'][0]['geometry']['location']['lat'];
			var lng = obj['results'][0]['geometry']['location']['lng'];
			return new google.maps.LatLng(lat, lng);	
		}
		else{
			alert("query returns 0 results, please input the correct address");
			return null;
		}
	}

	function map_obj(mapOptions){
		return new google.maps.Map(document.getElementById("map_canvas"),
		    mapOptions);
	}

	// Get current location when first loading the page
	function initialize() {
		var mapOptions = {
		  zoom: 14,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var pos = new google.maps.LatLng(position.coords.latitude,
					position.coords.longitude);
				var marker = new google.maps.Marker({
					position: pos,
					map: map,
					title: 'Your current location.'
				});
				set_position(position.coords.latitude, position.coords.longitude);
				map.setCenter(pos);
				google.maps.event.addListener(map, 'center_changed', function() {
				// 3 seconds after the center of the map has changed, pan back to the
				// marker.
					window.setTimeout(function() {
						map.panTo(marker.getPosition());
					}, 2000);
				});
			}, function() {
				handleNoGeolocation(true);
			});
		} else {
			// Browser doesn't support Geolocation
			handleNoGeolocation(false);
		}

		var map = map_obj(mapOptions);

	}


	// Write current latitude and longitute to the text on the right side of page.
	function set_position(pos_lat, pos_long){
		document.getElementById('description').innerHTML = "Latitude of current location: " + pos_lat + '<br>' + "Longtitue of current location: " + pos_long ;
	}

	function handleNoGeolocation(errorFlag) {
		console.log("tawedfasd");
		if (errorFlag) {
			var content = 'Error: The Geolocation service failed.';
		} else {
			var content = 'Error: Your browser doesn\'t support geolocation.';
		}

		var options = {
			map: map,
			position: new google.maps.LatLng(60, 105),
			content: content
		};

		var infowindow = new google.maps.InfoWindow(options);
		map.setCenter(options.position);
	}


	function loadScript() {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
		  '&signed_in=true&callback=initialize';
		document.body.appendChild(script);
	}

	function changecenter(){
		var my_position = get_position();
		var mapOptions = {
		  center: my_position,
		  zoom: 15,
		};
		var map = map_obj(mapOptions);
		var marker = new google.maps.Marker({
		  position: my_position,
		  map: map,
		  title: get_address()
		});
	}
	// Initially load
	window.onload = loadScript;