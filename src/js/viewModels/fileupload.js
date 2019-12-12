'use strict';

define([
  'knockout',
  'ojs/ojlogger',
  'ojs/ojformlayout',
  'ojs/ojlabel',
  'ojs/ojradioset',
  'ojs/ojfilepicker',
  'ojs/ojbutton',
],
function (ko, Logger) {

  Logger.option('level', Logger.LEVEL_INFO);

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

    // oj-file-picker event listner: ojBeforeSelect
    // eslint-disable-next-line no-unused-vars
    this.beforeSelectAction = function (event) {
      // event.detail.accept(new Promise(function (resolve, reject) {
      //   // ユーザーが選択したファイルのアップロード前に実行したい非同期処理があればここに書く
      //   // 前処理が成功したら resolve()
      //   // 前処理が失敗したら reject(errormessage)
      // }));
    };

    // oj-file-picker event listener: ojInvalidSelect
    this.invalidSelectAction = function (event) {
      if (event.detail.until) {
        // accept で指定した MIME タイプとは異なるファイルを選択した場合
      }
      else {
        // ojBeforeSelect イベントのリスナーで reject された場合
      }
    };

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
      Promise.all(promises).then(
        function () {
          this.uploadStatus('アップロード完了');
          this.selectedFiles.removeAll();
        }.bind(this),
        function (error) {
          Logger.error(error);
        }
      );
    }.bind(this);

    const uploadFile = function (file) {
      // eslint-disable-next-line no-unused-vars
      return new Promise(function (resolve, reject) {
        Logger.info(file.name);
        setTimeout(function () {
          resolve();
        }, 1000);
      });
    };
  };

  return new FileUploadViewModel;

});