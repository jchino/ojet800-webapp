'use strict';

define([
  'knockout',
  'ojs/ojlogger',
  'ojs/ojformlayout',
  'ojs/ojlabel',
  'ojs/ojradioset',
  'ojs/ojfilepicker',
],
function (ko, Logger) {

  Logger.option('level', Logger.LEVEL_INFO);

  const FileUploadViewModel = function () {
    this.acceptTxt = ko.observable('all');
    this.accept = ko.pureComputed(function () {
      if (this.acceptTxt() && this.acceptTxt() === 'image') {
        return ['image/*'];
      }
      else {
        return [];
      }
    }.bind(this));
    this.selectOn = ko.observable('auto');
    this.selectionMode = ko.observable('single');
    
    this.selectedFiles = ko.observableArray();

    // Event Listeners
    this.beforeSelectAction = function (event) {
      Logger.info(event.type);
      Logger.info(event.detail.files);
      // Logger.info(event.detail.accept);
    };

    this.selectAction = function (event) {
      Logger.info(event.type);
      Logger.info(event.detail.files);
    };

    this.invalidSelectAction = function (event) {
      Logger.info(event.type);
    };
  };

  return new FileUploadViewModel();

});