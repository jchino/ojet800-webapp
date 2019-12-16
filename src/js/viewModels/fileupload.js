'use strict';

define([
  'knockout',
  'ojs/ojarraydataprovider',
  'ojs/ojlogger',
  'ojs/ojformlayout',
  'ojs/ojradioset',
  'ojs/ojfilepicker',
  'ojs/ojmessages',
  'ojs/ojbutton',
],
// eslint-disable-next-line no-unused-vars
function (ko, ArrayDataProvider, Logger) {

  const FileUploadViewModel = function () {
    // selected file(s)
    this.selectedFiles = ko.observableArray();
    this.selectedNames = ko.pureComputed(function () {
      const names = [];
      for (let i = 0; i < this.selectedFiles().length; i++) {
        names.push(this.selectedFiles()[i].name);
      }
      return names;
    }.bind(this));

    // invalid file(s) message
    this.invalidMsgs = ko.observableArray();
    this.msgsProvider = new ArrayDataProvider(this.invalidMsgs); 

    // button's enable/disable control
    this.disabledUploadBtn = ko.observable(true);

    // uplad status text
    this.uploadStatus = ko.observable('');

    // oj-file-picker property: accept
    this.acceptTxt = ko.observable('all');
    this.accept = ko.pureComputed(function () {
      return this.acceptTxt() === 'image' ? ['image/*'] : [];
    }.bind(this));

    // oj-file-picker property: select-on
    this.selectOn = ko.observable('auto');

    // oj-file-picker property: selection-mode
    this.selectionMode = ko.observable('single');

    // oj-file-picker event listener: ojInvalidSelect
    this.invalidSelectAction = function (event) {
      this.invalidMsgs(event.detail.messages);
      if (event.detail.until) {
        event.detail.until.then(
          // ドラッグしていたマウスのポインタが外れたらメッセージをクリアする (Chrome, Firefox, Edge)
          function () {
            this.invalidMsgs.removeAll();
          }.bind(this)
        );
      }
    }.bind(this);

    // oj-file-picker event listner: ojBeforeSelect
    // eslint-disable-next-line no-unused-vars
    this.beforeSelectAction = function (event) {
      // Safari は ojInvalidSelect イベントで設定されたメッセージがクリアされないことがあるので
      // 念のためここでクリア
      this.invalidMsgs.removeAll();
      // event.detail.accept(new Promise(function (resolve, reject) {
      //   // ユーザーが選択したファイルのアップロード前に実行したい非同期処理があればここに書く
      //   // 前処理が成功したら resolve()
      //   // 前処理が失敗したら reject() --> ojInvalidSelect イベントが発火されるが、event.detail.until は null
      // }));
    }.bind(this);

    // oj-file-picker event listener: ojSelect
    this.selectAction = function (event) {
      const files = event.detail.files;
      for (let i = 0; i < files.length; i++) {
        this.selectedFiles.push(files[i]);
      }
      this.disabledUploadBtn(false);
    }.bind(this);

    // oj-button event listener: ojAction
    this.uploadFiles = function () {
      this.uploadStatus('アップロード処理中');
      this.disabledUploadBtn(true);
      const promises = [];
      for (let i = 0; i < this.selectedFiles().length; i++) {
        promises.push(uploadFile(this.selectedFiles()[i]));
      }
      // Promise.all(promises).then(
      //   function () {
      //     this.uploadStatus('アップロード完了');
      //     this.selectedFiles.removeAll();
      //   }.bind(this),
      //   function (error) {
      //     Logger.error(error);
      //   }
      // );
    }.bind(this);

    // eslint-disable-next-line no-unused-vars
    const uploadFile = function (file) {
      // eslint-disable-next-line no-unused-vars
      // return new Promise(function (resolve, reject) {
      //   const xhr = new XMLHttpRequest();
      //   xhr.open('POST', 'http://hostname:port/path/resource');
      //   xhr.setRequestHeader('Authorization', 'Basic xxxxxxxx');
      //   xhr.send(file);
      //   xhr.onload = function () {
      //     resolve();
      //   };
      //   xhr.onerror = function () {
      //     reject();
      //   };
      // });
    };
  };

  return FileUploadViewModel;

});