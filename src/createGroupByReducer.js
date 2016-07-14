import _ from 'lodash'
import warning from 'warning'
import {Set, List, fromJS} from 'immutable'

export default function createGroupByReducer(actionTypes, groupingKey, options={}) {
  const defaultState = fromJS({})
  const [loadAction, deleteAction] = actionTypes
  const keyFn = options.keyFn || (val => val ? `${val}` : null)

  return function groupBy(_state=defaultState, action={}) {
    let state = _state

    if (deleteAction && action.type === deleteAction) {
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

    else if (action.type === loadAction) {
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
