'use strict';

exports.__esModule = true;

var _flUtils = require('fl-utils');

//import {ROUTER_DID_CHANGE} from 'redux-router' // copied here to avoid a dependency
var ROUTER_DID_CHANGE = '@@reduxReactRouter/routerDidChange';

var locsEqual = function locsEqual(locA, locB) {
  return locA.pathname === locB.pathname && locA.search === locB.search;
};

exports['default'] = function (store) {
  return function (next) {
    return function (action) {
      var router = store.getState().router;
      if (action.type === ROUTER_DID_CHANGE && router && !locsEqual(action.payload.location, router.location)) {
        var components = action.payload.components;

        _flUtils.fetchComponentData({ store: store, components: components, action: action });
      }
      next(action);
    };
  };
};

module.exports = exports['default'];