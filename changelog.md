
## [Unreleased]
  
## [0.5.0]
  - [createPaginationReducer] Added `countSuffix`, `deleteSuffix` and `loadSuffix` options so actions do not have to conform to harcoded conventions.
  - [createPaginationReducer] `deleteSuffix` defaults to `_DELETE_SUCCESS` rather than `_DEL_SUCCESS`

## [0.4.3]
  - [createPaginationSelector] Removed `loading` from selector, which now includes `totalItems`.

## [0.4.0]
  - [createPaginationReducer] Added `append` option for endless scrolling style loading. When true the list of visibleItems will continue to grow rather than reset with each page of results loaded.
  - [createPaginationSelector] Added `modelsName` and `paginationName` options to allow for multiple paginations per reducer. The former is the name of the model map on the reducer (usually 'models') and the latter is the name of the pagination results on the reducer (usually 'pagination'). 

## [0.3.0]
  - Added support for a function on options, `keyFromAction`. If present, it's called with the current action and should return a key for which a set will be initialised even when there are no models on the action. 
  - Removing a key now empties its set rather than deleting the key.

## [0.3.0]
  - Added support for a function on options, `keyFromAction`. If present, it's called with the current action and should return a key for which a set will be initialised even when there are no models on the action. 
  - Removing a key now empties its set rather than deleting the key.

## [0.2.0]
  - Added `observeStore`, a method that will call a function when a value in the store changes
  - `fetchComponentDataMiddleware` moved to its own package, `fetch-component-data`
  
## [0.1.0]
  - Module created to split out react dependencies from redux, so the latter can be used with react-native
  - Yoinked reducers and selectors (groupBy and pagination) from fl-react-utils
  

observeStore
------------

Arguments:

```javascript
observeStore(
  store,                  // your redux store

  spyValueFn,             // Specify a function that returns the value you want to observer from the store
                          // When the return value of this function changes the change handler function is called
  
  changeHandlerFn         // The function to call whenever the observed value changes
)
```

Example:

Here we're detecting when the current user's access token has been added or changed in our auth reducer. Then setting a bearer token on future requests when it does.

```javascript
observeStore(store, store => store.auth.accessToken, accessToken => {
  const header = {authorization: accessToken ? `Bearer ${accessToken}` : null}
  requestModifier.setHeader(header)
  console.log('Auth token header set. Wowee', header)
})
```
