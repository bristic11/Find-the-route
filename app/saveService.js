"use strict";

angular.module('savedata', [])
.factory('SaveService', function($log) {
    var o = {
		loadData: function() {
			var routesStr = localStorage.getItem('data');
			var me;
			if (routesStr === null || routesStr === "") {
				me = [];
				localStorage.setItem('data', JSON.stringify(me));	
				$log.debug("SaveService.loadData: localStorage empty, me = " + JSON.stringify(me));
				return me;
			} else {
				try {
					me = JSON.parse(routesStr);
					// alert(routesStr);
					//alert(me);
					$log.debug("SaveService.loadData: me from localStorage = " + JSON.stringify(me));
					return me;					
				} catch (e) {
					$log.debug("SaveService.loadData: error: " + e);
				}
			
			}
		},
		saveData: function(me) {
			try {
				localStorage.setItem('data', JSON.stringify(me));				
				$log.debug("SaveService.saveData: writing to localStorage: " + JSON.stringify(me));
			} catch (e) {
				$log.debug("SaveService.saveData: error: " + e);				
			}
		}
	};
	
    return o;
});

 