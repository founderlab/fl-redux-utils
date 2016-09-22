
## [Unreleased]
  

## [0.2.0]
  - Added `observeStore`, a method that will call a function whena  value in the store changes
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

Here's an example where we're setting a bearer token on future requests when we detect that the current user's access token has been added or changed in our auth reducer:

```javascript
observeStore(store, store => store.auth.accessToken, accessToken => {
  const header = {authorization: accessToken ? `Bearer ${accessToken}` : null}
  requestModifier.setHeader(header)
  console.log('Auth token header set. Wowee', header)
})
```
