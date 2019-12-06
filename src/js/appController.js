'use strict';

define([
  'ojs/ojcorerouter',
  'ojs/ojmodulerouter-adapter',
  'ojs/ojknockoutrouteradapter',
  'ojs/ojknockout',
  'ojs/ojmodule-element',
],
function (CoreRouter, ModuleRouterAdapter, KnockoutRouterAdapter) {
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
    this.selection = new KnockoutRouterAdapter(router);
    router.sync();
  };

  return new AppController();
});