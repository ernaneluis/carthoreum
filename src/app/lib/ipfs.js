import IPFS from 'ipfs'

let node = null

export const init = () => {
  node = new IPFS({ repo: String(Math.random() + Date.now()) })
  node.once('ready', () => console.log('IPFS node is ready'))
  return node
}

export const store = ({ data }) => {
  // data is buffer
  return node.files.add({
    path: 'myfileEncrypted.txt',
    content: data,
  })
}

export const get = ({ hash }) => {
  // buffer: true results in the returned result being a buffer rather than a stream
  return node.files.cat(hash)
}
