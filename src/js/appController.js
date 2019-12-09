'use strict';

define([
  'knockout',
  'jquery',
  'ojs/ojcorerouter',
  'ojs/ojmodulerouter-adapter',
  'ojs/ojknockoutrouteradapter',
  'ojs/ojknockout',
  'ojs/ojmodule-element',
],
function (ko, $, CoreRouter, ModuleRouterAdapter, KnockoutRouterAdapter) {
  const AppController = function () {
    // define CoreRouter
    const routes = [
      { path: '', redirect: 'home' },
      { path: 'home', detail: { label: 'Home' } },
    ];
    const router = new CoreRouter(routes);

    // define ModuleRouterAdapter
    this.module = new ModuleRouterAdapter(
      router,
      { animationCallback: function () { return 'fade'; } }
    );

    // define KnockoutRouterAdapter
    this.selection = new KnockoutRouterAdapter(router);

    // controll breadcrumb hide/show
    this.displayBreadcrumb = ko.pureComputed(function () {
      if (!this.selection.state()) {
        $('#breadcrumb').hide();
        return false;
      }
      else {
        const toggle = this.selection.path() !== 'home';
        $('#breadcrumb').toggle(toggle);
        return toggle;
      }
    }.bind(this));

    // route home
    this.returnHome = function () {
      router.go({ path: 'home' });
    };

    router.sync();
  };

  return new AppController();
});