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

     //alert($("#start").val());
     //$("#start").val(item.start); // .trigger( "change");
     //$("#end").val(item.end); // .trigger( "change");

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
  	

  // init
  /*
    $scope.routes = [
					{"id": 0,  "start": "Pirot",     "end": "Nis"},
          {"id": 3,  "start": "Belgrade",  "end": "Nis"},
          {"id": 1,  "start": "Kragujevac","end": "Lapovo"},
          {"id": 2,  "start": "Srpskih Vladara 2,Pirot",  "end": "Srpskih Vladara 112,Pirot"}
    ];
*/

    
  $scope.routes =  SaveService.loadData();   
    
    

    

  $scope.readyToSave = false;
						  
 
 });
