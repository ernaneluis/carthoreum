import IPFS from 'ipfs'
import store from '../store/store'
import {
  setIpfsUploadProgress,
  setIsIpfsReady,
} from '../store/actions/uiActions'

let node = null
let fileSize = 0

export const init = () => {
  node = new IPFS()
  node.once('ready', async () => {
    console.log('IPFS node is ready', (await node.version()).version)
    store.dispatch(setIsIpfsReady(true))
  })
  return node
}

export const upload = ({ data, name }) => {
  fileSize = data.length

  return node.files.add(
    {
      path: `${name}.encrypted.pdf`,
      content: Buffer.from(data.buffer),
    },
    {
      progress: fileDone => {
        const progress = (fileDone / fileSize) * 100
        store.dispatch(setIpfsUploadProgress(progress))
      },
    }
  )
}

export const get = ({ hash }) => {
  // buffer: true results in the returned result being a buffer rather than a stream
  return node.files.cat(hash)
}
