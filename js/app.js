"use strict";

$(document).ready(function() {

	//clears search text when page is refreshed
	$('#search').val('');

	var mapElem = document.getElementById('map');

	var center = {
		lat: 47.6,
		lng: -122.3
	};

	var map = new google.maps.Map(mapElem, {
		center: center,
		zoom: 12
	});

	//array of styles for the basic map
	var styles = [
        {
            stylers: [
                { hue: "#0000cc" },
                { saturation: -10 },
            ]
        }
    ];

    map.setOptions({styles: styles});

	//adds a traffic layer on the map to view traffic congestion
	var trafficLayer = new google.maps.TrafficLayer();
  	trafficLayer.setMap(map); 

  	//resizes the map according to window height
	$(window).resize(function() {
		$('#map').height($(window).height() - $('#map').position().top - 20);
	});

	var infoWindow = new google.maps.InfoWindow();

	var cameras;
	var markers = [];

	//JSON file from seattle.gov contains traffic camera data
	$.getJSON("http://data.seattle.gov/resource/65fc-btcc.json")
		.done(function(data) {
			cameras = data;
			//image for markers
			var image = "img/camera.png";
			data.forEach(function(camera) {
				var marker = new google.maps.Marker({
					position: {
						lat: Number(camera.location.latitude),
						lng: Number(camera.location.longitude)
					},
					map: map,
					icon: image,
					//makes the markers "drop" into the page upon load
					animation: google.maps.Animation.DROP
				});
				markers.push(marker);

				//creates the markers/info windows for the map
				google.maps.event.addListener(marker, 'click', function() {
					var html = '<p id="cameralabel">' + camera.cameralabel + '</p>';
					html += '<img src="' + camera.imageurl.url + '"">';

					map.panTo(marker.getPosition());

					infoWindow.setContent(html);
					infoWindow.open(map, this);
				});

				//closes an open info window when user clicks anywhere on the map
				google.maps.event.addListener(map, 'click', function() {
					infoWindow.close();
				});

				//uses the search text to only show camera markers relavent to the user's search
				$('#search').bind('search keyup', function() {
					var cameraLocation = camera.cameralabel.toLowerCase();
					var searchText = $('#search').val().toLowerCase();

					if(cameraLocation.indexOf(searchText) == -1) {
						marker.setMap(null);
					} else {
						marker.setMap(map);
					}
				});
			});
		})

		.fail(function(error) {
			alert(error);
		})
});