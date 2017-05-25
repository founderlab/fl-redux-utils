import _ from 'lodash' // eslint-disable-line
import {fromJS} from 'immutable'

export default function createPaginationReducer(actionType, _options={}) {

  const defaultState = fromJS({
    visible: [],
    total: 0,
    currentPage: 0,
  })

  const options = _.defaults(_options, {
    append: false,
    countSuffix: '_COUNT_SUCCESS',
    deleteSuffix: '_DELETE_SUCCESS',
    loadSuffix: '_LOAD_SUCCESS',
  })

  const {countSuffix, deleteSuffix, loadSuffix} = options

  return function pagination(_state=defaultState, action={}) {
    let state = _state

    if (action.type === actionType + countSuffix) {
      state = state.merge({total: +action.res})
    }

    else if (action.type === actionType + deleteSuffix) {
      const visible = state.get('visible').toJSON()
      state = state.merge({visible: _.without(visible, action.deletedId)})
    }

    else if (action.type === actionType + loadSuffix && action.page) {
      if (options.append && action.page > +state.get('currentPage')) {
        // Only append if the page being loaded is higher than the current page
        // If a lower number assume it's a refresh and behave as if append was not set
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
