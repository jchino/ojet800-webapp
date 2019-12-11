'use strict';

define([
  'appController',
  'samples',
  'knockout',
  'ojs/ojarraydataprovider',
  'ojs/ojlistview',
],
function(app, samples, ko, ArrayDataProvider) {

  const HomeViewModel = function () {
    this.samplesADP = new ArrayDataProvider(samples, { keyAttributes: 'path' });
    
    this.clickListItem = function (event, ui) {
      const path = ui.key;
      app.go(path);
    };
  };

  return new HomeViewModel();
});