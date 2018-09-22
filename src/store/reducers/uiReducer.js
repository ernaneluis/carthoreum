import {
  SET_IPFS_UPLOAD_PROGRESS,
  SET_ENCRYPTING_FILE_PROGRESS,
  SET_IS_IPFS_READY,
} from '../typesReducers'

const initialState = {
  encryptingProgress: 0,
  ipfsUploadProgress: 0,
  isIpfsReady: false,
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_IPFS_UPLOAD_PROGRESS:
      console.log('uploading progress: ', payload.progress)
      return {
        ...state,
        ipfsUploadProgress: payload.progress,
      }

    case SET_ENCRYPTING_FILE_PROGRESS:
      console.log('encrypting progress: ', payload.progress)
      return {
        ...state,
        encryptingProgress: payload.progress,
      }

    case SET_IS_IPFS_READY:
      return {
        ...state,
        isIpfsReady: payload.isIpfsReady,
      }

    default:
      return state
  }
}
