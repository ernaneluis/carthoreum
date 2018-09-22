import {
  SET_IPFS_UPLOAD_PROGRESS,
  SET_ENCRYPTING_FILE_PROGRESS,
  SET_IS_IPFS_READY,
} from '../typesReducers'

export const setIpfsUploadProgress = progress => async dispatch =>
  dispatch({ type: SET_IPFS_UPLOAD_PROGRESS, payload: { progress } })

export const setEncryptingFileProgress = progress => async dispatch =>
  dispatch({ type: SET_ENCRYPTING_FILE_PROGRESS, payload: { progress } })

export const setIsIpfsReady = isIpfsReady => async dispatch =>
  dispatch({ type: SET_IS_IPFS_READY, payload: { isIpfsReady } })
