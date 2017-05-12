import _ from 'lodash' // eslint-disable-line
import {fromJS} from 'immutable'

export default function createPaginationReducer(actionType, options={}) {

  const defaultState = fromJS({
    visible: [],
    currentPage: 1,
  })

  return function pagination(_state=defaultState, action={}) {
    let state = _state

    if (action.type === actionType + '_COUNT_SUCCESS') {
      state = state.merge({total: +action.res})
    }

    else if (action.type === actionType + '_DEL_SUCCESS') {
      const visible = state.get('visible').toJSON()
      state = state.merge({visible: _.without(visible, action.deletedId)})
    }

    else if (action.type === actionType + '_LOAD_SUCCESS' && action.page) {
      if (options.append) {
        const current = state.get('visible').toJSON()
        state = state.merge({visible: current.concat(action.ids), currentPage: action.page})
      }
      else {
        state = state.merge({visible: action.ids, currentPage: action.page})
      }
    }

    return state
  }
}
