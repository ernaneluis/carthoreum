import IPFS from 'ipfs'

let node = null

export const init = () => {
  node = new IPFS({ repo: String(Math.random() + Date.now()) })
  node.once('ready', () => console.log('IPFS node is ready'))
  return node
}

export const store = ({ data }) => {
  // data is buffer
  node.files.add(data, (err, res) => {
    if (err || !res) return console.error('ipfs add error', err, res)

    res.forEach(file => {
      if (file && file.hash) console.log('successfully stored', file.hash)
    })
  })
}

export const get = ({ hash }) => {
  // buffer: true results in the returned result being a buffer rather than a stream
  node.files.cat(hash, (err, data) => {
    if (err) return console.error('ipfs cat error', err)
    console.log('get data ', data.toString())
    // document.getElementById('hash').innerText = hash
    // document.getElementById('content').innerText = data
  })
}
