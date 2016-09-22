'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = createGroupByReducer;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _immutable = require('immutable');

function createGroupByReducer(actionTypes, groupingKey) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var defaultState = _immutable.fromJS({});
  var load = undefined;
  var del = undefined;
  var loadActions = undefined;
  var deleteActions = undefined;

  if (_lodash2['default'].isArray(actionTypes)) {
    load = actionTypes[0];
    del = actionTypes[1];
  } else if (_lodash2['default'].isObject(actionTypes)) {
    load = actionTypes.load;
    del = actionTypes.del;
  }
  if (load) loadActions = _lodash2['default'].isArray(load) ? load : [load];
  if (del) deleteActions = _lodash2['default'].isArray(del) ? del : [del];

  var keyFn = options.keyFn || function (val) {
    return val ? '' + val : null;
  };

  return function groupBy() {
    var _state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];

    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var state = _state;

    if (deleteActions && _lodash2['default'].includes(deleteActions, action.type)) {
      var id = action.deletedModel.id;
      var _key = groupingKey(action.deletedModel);
      var key = keyFn(_key);
      var current = state.get(key);

      if (_lodash2['default'].isNil(key)) {
        _warning2['default'](false, '[fl-redux-utils] groupByReducer: groupingKey(action.deletedModel) was nil for deleted model ' + JSON.stringify(action.deletedModel));
      } else if (!current) {
        _warning2['default'](false, '[fl-redux-utils] groupByReducer: state.get(key) doesnt exist for key ' + key + ' from deleted model ' + JSON.stringify(action.deletedModel));
      } else {
        if (_immutable.Set.isSet(current)) {
          var _state$merge;

          return state.merge((_state$merge = {}, _state$merge[key] = current.remove(id), _state$merge));
        }
        return state.remove(key);
      }
    } else if (loadActions && _lodash2['default'].includes(loadActions, action.type)) {
      var byGroup = _lodash2['default'].groupBy(action.models, function (model) {
        return groupingKey(model);
      });

      _lodash2['default'].forEach(byGroup, function (models, _key) {
        var _state$merge2;

        if (_lodash2['default'].isNil(_key)) return;
        var key = keyFn(_key);
        var groupState = undefined;

        if (options.single) {
          groupState = models[0] && models[0].id;
        } else {
          groupState = state.get(key) || new _immutable.Set();
          if (_immutable.List.isList(groupState)) groupState = new _immutable.Set(groupState.toJSON());

          _lodash2['default'].forEach(models, function (model) {
            if (!groupState.includes(model.id)) groupState = groupState.add(model.id);
          });
        }
        state = state.merge((_state$merge2 = {}, _state$merge2[key] = groupState, _state$merge2));
      });
    }

    return state;
  };
}

module.exports = exports['default'];