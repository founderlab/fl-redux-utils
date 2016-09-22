"use strict";

exports.__esModule = true;
exports["default"] = observeStore;

function observeStore(store, select, onChange) {
  var currentState = undefined;

  function handleChange() {
    var nextState = select(store.getState());
    if (nextState !== currentState) {
      currentState = nextState;
      onChange(currentState);
    }
  }

  var unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}

module.exports = exports["default"];