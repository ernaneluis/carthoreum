import {
  createSharedKey,
  encrypt,
  decrypt,
  encryptFile,
  decryptFile,
} from './encryption'
import Wallet from 'ethereumjs-wallet'

// currently jsdom do not support crypto so it needs to be passed along to window object
import crypto from '@trust/webcrypto'
window.crypto = crypto

describe(`createSharedKey()`, () => {
  it('returns an ethereum private key string', () => {
    const sharedKey = createSharedKey()

    console.log({ sharedKey })
    expect(sharedKey).not.toBeNull()
  })
})

describe(`encrypt() and decrypt()`, () => {
  it('encrypt a shared key with a public key and decrypted using its private key', () => {
    const sharedKey = createSharedKey()

    console.log('sharedKey', sharedKey.toString('hex'))
    const key = Wallet.generate()
    const ethereumPublicKey = key.getPublicKey()
    const ethereumPrivateKey = key.getPrivateKey()

    const encryptedSharedKey = encrypt({ data: sharedKey, ethereumPublicKey })
    console.log('encryptedSharedKey ', encryptedSharedKey.toString('hex'))

    const decryptedSharedKey = decrypt({
      encryptedData: encryptedSharedKey,
      ethereumPrivateKey,
    })

    console.log('decryptedSharedKey ', decryptedSharedKey.toString('hex'))

    expect(decryptedSharedKey).toEqual(sharedKey)
    expect(decryptedSharedKey.toString('hex')).toEqual(
      sharedKey.toString('hex')
    )
  })
})

describe(`encryptFile() and decryptFile()`, () => {
  it('encrypt a uploaded file with a shared key', async () => {
    const sharedKey = createSharedKey().toString('hex')
    const filetest = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    console.log({ filetest })
    // / get raw encrypted packets as Uint8Array
    const encryptedFile = await encryptFile({
      data: filetest,
      password: sharedKey,
    })
    // console.log({ encryptedFile })

    const decryptedFile = await decryptFile({
      encryptedData: encryptedFile,
      password: sharedKey,
    })

    console.log({ decryptedFile })
    expect(decryptedFile).toEqual(filetest)
  })
})
