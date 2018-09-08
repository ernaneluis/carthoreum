import {
  compose as _compose,
  applyMiddleware,
  combineReducers,
  createStore,
} from 'redux'
import { connectRoutes } from 'redux-first-router'
import { reducer as formReducer } from 'redux-form'
import thunkMiddleware from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'

import routesMap from '../app/routesMap'

export const history = createHistory()

// setup redux first router with allias names
// https://github.com/faceyspacey/redux-first-router
const {
  reducer: locationReducer,
  middleware: routerMiddleware,
  enhancer: routerEnhancer,
  thunk,
} = connectRoutes(history, routesMap, { initialDispatch: true })

const rootReducer = combineReducers({
  form: formReducer,
  location: locationReducer,
})

const enhancers = [routerEnhancer]
const middlewares = [thunkMiddleware, routerMiddleware]

// set up react dev tool with redux
// http://extension.remotedev.io/#usage
const compose =
  process.env.NODE_ENV === 'development'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || _compose
    : _compose

const composedEnhancers = compose(
  ...enhancers,
  applyMiddleware(...middlewares)
)

const store = createStore(rootReducer, composedEnhancers)

// wait for route to complete thunks before rendering
const waitForThunk = () => thunk(store)

export default store
