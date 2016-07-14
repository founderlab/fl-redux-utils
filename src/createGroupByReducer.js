import _ from 'lodash'
import warning from 'warning'
import {Set, List, fromJS} from 'immutable'

export default function createGroupByReducer(actionTypes, groupingKey, options={}) {
  const defaultState = fromJS({})
  let load
  let del
  let loadActions
  let deleteActions

  if (_.isArray(actionTypes)) {
    load = actionTypes[0]
    del = actionTypes[1]
  }
  else if (_.isObject(actionTypes)) {
    load = actionTypes.load
    del = actionTypes.del
  }
  if (load) loadActions = _.isArray(load) ? load : [load]
  if (del) deleteActions = _.isArray(del) ? del : [del]

  const keyFn = options.keyFn || (val => val ? `${val}` : null)

  return function groupBy(_state=defaultState, action={}) {
    let state = _state

    if (deleteActions && _.includes(deleteActions, action.type)) {
      const id = action.deletedModel.id
      const _key = groupingKey(action.deletedModel)
      const key = keyFn(_key)
      const current = state.get(key)

      if (_.isNil(key)) {
        warning(false, `[fl-redux-utils] groupByReducer: groupingKey(action.deletedModel) was nil for deleted model ${JSON.stringify(action.deletedModel)}`)
      }
      else if (!current) {
        warning(false, `[fl-redux-utils] groupByReducer: state.get(key) doesnt exist for key ${key} from deleted model ${JSON.stringify(action.deletedModel)}`)
      }
      else {
        if (Set.isSet(current)) {
          return state.merge({[key]: current.remove(id)})
        }
        return state.remove(key)
      }
    }

    else if (loadActions && _.includes(loadActions, action.type)) {
      const byGroup = _.groupBy(action.models, model => groupingKey(model))

      _.forEach(byGroup, (models, _key) => {
        if (_.isNil(_key)) return
        const key = keyFn(_key)
        let groupState

        if (options.single) {
          groupState = models[0] && models[0].id
        }
        else {
          groupState = state.get(key) || new Set()
          if (List.isList(groupState)) groupState = new Set(groupState.toJSON())

          _.forEach(models, model => {
            if (!groupState.includes(model.id)) groupState = groupState.add(model.id)
          })
        }
        state = state.merge({[key]: groupState})
      })
    }

    return state
  }
}
