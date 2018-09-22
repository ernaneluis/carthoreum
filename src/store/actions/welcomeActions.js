import {
  CREATE_DOCUMENT_REQUEST,
  CREATE_DOCUMENT_SUCCESS,
  CREATE_DOCUMENT_FAILURE,
} from '../typesReducers'

import * as web3Helpers from '../../lib/web3'

export const createDocument = form => async dispatch => {
  console.log({ form })
  dispatch({ type: CREATE_DOCUMENT_REQUEST })

  return web3Helpers
    .createDocument({ document: form })
    .then(() => {
      dispatch({ type: CREATE_DOCUMENT_SUCCESS })
    })
    .catch(error => {
      dispatch({ type: CREATE_DOCUMENT_FAILURE, error: error.message })
    })
}
