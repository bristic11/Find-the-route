   function initMap() {
	  
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 11,
          center: {lat: 43.3167, lng: 21.89  } //  nis
        });
	    var infoWindow = new google.maps.InfoWindow({map: map});

        // HTML5 geolocation
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            //infoWindow.setPosition(pos); // mark the geolocation
	        map.setCenter(pos);
          });
        }
	  	  
        // autocomplete for start/end, search to geographical location  
        new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById('start')),  {types: ['geocode']}
		);
	 	new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById('end')),    {types: ['geocode']}
		);			

         
        var directionsService = new google.maps.DirectionsService;
 	
        var geocoder = new google.maps.Geocoder();

        var directionsDisplay = new google.maps.DirectionsRenderer({map: map});
		
        // start / end 
        onChangeHandler = function() {
          calculateAndDisplayRoute( directionsDisplay, directionsService, map, geocoder);
        };
        document.getElementById('start').addEventListener('change', onChangeHandler);
        document.getElementById('end').addEventListener('change', onChangeHandler);		
		
      }

      function calculateAndDisplayRoute(directionsDisplay, directionsService, map, geocoder) {
		    				
        directionsService.route({
          origin: document.getElementById('start').value,
          destination: document.getElementById('end').value,
          travelMode: 'DRIVING'
        }, function(response, status) {
		  var routeDetails; 
          if (status === 'OK') {
		    // show route
            directionsDisplay.setDirections(response);
			// calculate distance and travel time
            routeDetails = calcRouteDetails(response);		
          } else { 
		    // no route => show map for start point
  			var address = document.getElementById('start').value;
			geocoder.geocode({'address': address}, function(results, status) {
			  if (status === 'OK') {
				map.setCenter(results[0].geometry.location);
				var marker = new google.maps.Marker({
				  map: map,
				  position: results[0].geometry.location
				});
				
			  }
			});
			routeDetails = "<br>"; // save one line for routeDetails
          }
		  document.getElementById('route_details').innerHTML = routeDetails;
        });
      }

	  //  distance and travel time
      function calcRouteDetails(directionResult) {
        var myRoute = directionResult.routes[0].legs[0];
		var distance = 0;
		var duration = 0;		
        for (var i = 0; i < myRoute.steps.length; i++) {
		  duration += myRoute.steps[i].duration.value;
		  distance += myRoute.steps[i].distance.value;		  
        }
		return "Distance "+formatDistance(distance)+"; Travel time "+ formatTravelTime(duration);
     }
	 
	 function formatDistance(distance) { // in meter
	   if(distance<1000) {
	     return ""+distance+" m";
	   }
	   return  ""+Math.round(distance/100)/10+" km";
	 }
	
	 function formatTravelTime(duration) { // in seconds
		if(duration>=3600) { // hours
		   return ""+ Math.floor(duration/3600)+"h "+Math.round((duration % 3600)/60)+"min";
		}
		if(duration>=60) {  // minutes
		  return ""+ Math.floor(duration/60)+"min "+(duration % 60)+" sec";
		} 
		return	""+ duration+" sec";
	 }  
	 
"use strict";

angular.module('app',['savedata'])
	.controller('findRouteCtrl', function($scope, SaveService) {
		
 
  $scope.showRoute = function() {
    var s =  "" +  $("#start").val()+ " "+  $("#end").val() ;
    for (var id in $scope.routes) {
       s+= "<br> " + id + " "+$scope.routes[id].start ;
    }     
    alert(s);
  }

  
  $scope.saveRoute = function() {	
    $scope.changeStartEnd()	
    if(!$scope.readyToSave) {
      return;
    }
    var start = $("#start").val().trim();
    var end = $("#end").val().trim();
    if( start!="" && end!="") {      
       var maxid = 0;
       for (var id in $scope.routes) {
            if(id>maxid) maxid=id;
       }  
       maxid++; 
       $scope.routes[$scope.routes.length] = {
          "id": maxid,
          "start" : start,
          "end" : end
       }
       SaveService.saveData($scope.routes); 
    }  
  }

  $scope.selectRoute = function(item) { 
     $("#start").val(item.start);
     $("#end").val(item.end);

     $scope.start1 = item.start;
     $scope.end1 = item.end;
     $scope.changeStartEnd();
     $scope.hideRoutesDialog();
    
     onChangeHandler();

    

  }  


  $scope.deleteRoute = function(item) {    
    var i = $scope.routes.indexOf(item);
    $scope.routes.splice(i,1);
    SaveService.saveData($scope.routes); 
  }  

  $scope.changeStartEnd = function() {
    $scope.readyToSave = false;
    var start = $("#start").val().trim();
    var end = $("#end").val().trim();
    if( start=="" || end=="") {   
       return;       
    }   
    for (var id in $scope.routes) {
        if(start==$scope.routes[id].start && end==$scope.routes[id].end ) {
          return;
        }
    } 
    $scope.readyToSave = true;
  }


  $scope.hideRoutesDialog = function() {
    $("#routesDialog").modal("hide");
  };
  	

 

    
  $scope.routes =  SaveService.loadData();   
    
    

    

  $scope.readyToSave = false;
						  
 
 });
