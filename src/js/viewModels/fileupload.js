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
  'ojs/ojinputtext',
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
    this.msgs = ko.observableArray();
    this.msgsProvider = new ArrayDataProvider(this.msgs);

    // button's enable/disable control
    this.disabledUploadBtn = ko.observable(true);

    // Upload Target Info
    this.uploadUrl = ko.observable(); // アップロード先の URL
    this.uploadHeader = ko.observable(); // アップロード時の Request Header
    this.uploadBodyType = ko.observable('binary'); // アップロード時のリクエスト・タイプ

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
      this.msgs(event.detail.messages);
      if (event.detail.until) {
        event.detail.until.then(
          // ドラッグしていたマウスのポインタが外れたらメッセージをクリアする (Chrome, Firefox, Edge)
          function () {
            this.msgs.removeAll();
          }.bind(this)
        );
      }
    }.bind(this);

    // oj-file-picker event listner: ojBeforeSelect
    // eslint-disable-next-line no-unused-vars
    this.beforeSelectAction = function (event) {
      // Safari は ojInvalidSelect イベントで設定したメッセージがクリアできないことがあるので念のためここでクリア
      this.msgs.removeAll();
      this.uploadStatus('');
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
      if (this.uploadBodyType() !== 'binary') {
        alert('未実装です');
        this.uploadStatus('');
      }
      else {
        const promises = [];
        for (let i = 0; i < this.selectedFiles().length; i++) {
          promises.push(uploadAsBinary(this.selectedFiles()[i]));
        }
        Promise.all(promises).then(
          function () {
            this.uploadStatus('アップロード完了');
            this.selectedFiles.removeAll();
          }.bind(this),
          function (error) {
            Logger.error(error);
          }
        );
      }
    }.bind(this);

    const uploadAsBinary = function (file) {
      return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', this.uploadUrl());
        const headers = JSON.parse(this.uploadHeader());
        const names = Object.keys(headers);
        for (let i = 0; i < names.length; i++) {
          xhr.setRequestHeader(names[i], headers[names[i]]);
        }
        xhr.send(file);

        // レスポンスが返ってきた場合
        xhr.onload = function () {
          let msg;
          if (xhr.status >= 200 && xhr.status < 300) {
            msg = {
              severity: 'info',
              summary: file['name'] + 'がアップロードされました',
            };
          }
          else {
            Logger.error(xhr.response);
            msg = {
              severity: 'error',
              summary: file['name'] + 'がアップロードできませんでした: ' + xhr.status + ' - ' + xhr.statusText,
            };
          }
          this.msgs.push(msg);
          resolve();
        }.bind(this);

        // 何かしらのエラーが起きた場合
        xhr.onerror = function (event) {
          Logger.error(event);
          this.msgs.push({
            severity: 'error',
            summary: file['name'] + 'がアップロードできませんでした',
          });
          reject();
        }.bind(this);
      }.bind(this));
    }.bind(this);
  };

  return FileUploadViewModel;

});