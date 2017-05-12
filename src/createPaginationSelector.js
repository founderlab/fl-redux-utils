import _ from 'lodash' // eslint-disable-line
import {createSelector} from 'reselect'

function paginationState(state, paginateOn) {
  if (_.isFunction(paginateOn)) return paginateOn(state)
  return state[paginateOn]
}

const defaultSelect = () => {}
const defaults = {
  loadingName: 'loading',
  modelsName: 'models',
  paginationName: 'pagination',
}

export default function createPaginationSelector(paginateOn, selectState=defaultSelect, _options={}) {
  const options = _.defaults(_options, defaults)
  console.log('options', options)
  return createSelector(
    state => state[paginateOn].get(options.loadingName),
    state => state[paginateOn].get(options.modelsName),
    state => state[paginateOn].get(options.paginationName),
    selectState,
    (loading, models, pagination, selectedState) => {
      const visibleItems = []
      if (loading) return _.extend({}, selectedState, {visibleItems, totalItems: 0, loading: true})

      const visibleIds = pagination.get('visible').toJSON()
      const totalItems = +(pagination.get('total'))

      _.forEach(visibleIds, id => visibleItems.push(models.get(id).toJSON()))

      return _.extend({}, selectedState, {visibleItems, totalItems})
    }
  )
}
