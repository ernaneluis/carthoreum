import { redirect } from 'redux-first-router'
import { isEmpty } from 'lodash'

import { toWelcome } from '../store/actions/routerActions'

const routesMap = {
  WELCOME: {
    path: '/',
    thunk: async (dispatch, getState) => {
      // must call restore wallet on route because thunk is called first than persistWallet
    },
  },

  CATCH_ALL_REDIRECT: {
    path: '*',
    thunk: async dispatch => await dispatch(redirect(toWelcome())),
  },
}

export default routesMap
