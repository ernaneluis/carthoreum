import { EventEmitter } from 'events'
import Dropzone from 'react-dropzone'
import React from 'react'
import styled from 'styled-components'

import { get } from 'lodash'
import { saveAs } from 'file-saver/FileSaver'
import { change } from 'redux-form'
import web3 from 'web3'

import store from '../../../store/store'

import {
  encryptFile,
  createSharedKey,
  decryptFile,
} from '../../../lib/encryption'

import * as ipfs from '../../../lib/ipfs'

const Preview = styled.iframe`
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
`

const DropArea = styled(Dropzone)`
  align-items: center;
  border-radius: 5px;
  border: 2px dashed grey;
  cursor: pointer;
  display: flex;
  height: 345px;
  justify-content: center;
`

const Text = styled.h3`
  color: grey;
  font-size: 1.1rem;
  margin: 0 0 35px 0;
`

const getFileName = files => get(files[0], 'name', '')

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = { progress: 0 }
    const ipfsNode = ipfs.init()
  }

  componentDidMount() {
    this.props.input.onChange(null)
  }

  render() {
    const field = this.props
    const name = get(this.props, 'field.name', '')
    const files = field.input.value || []

    return (
      <div className="text-center mb-2">
        <DropArea
          className="mb-2"
          accept="application/pdf"
          name={name}
          multiple={false}
          onDrop={(accepted, rejected) => {
            const fileObjects = accepted
            fileObjects.forEach(fileObject => {
              console.log({ fileObject })
              if (!fileObject || fileObject.size > 5 * 1024 * 1024) {
                alert('Only .pdf files under 5MB are accepted.')
                return
              }

              var reader = new FileReader()
              // Closure to capture the file information.
              reader.onload = (theFile => {
                return async e => {
                  const secret = createSharedKey().toString('hex')
                  store.dispatch(change('docForm', 'secret', secret))

                  //base64 fiel format
                  const originalFileAsUint8Array = new Uint8Array(
                    e.target.result
                  )

                  const sha3Hash = web3.utils.sha3(originalFileAsUint8Array)
                  store.dispatch(change('docForm', 'sha3Hash', sha3Hash))

                  const encryptedFile = await encryptFile({
                    data: originalFileAsUint8Array,
                    password: secret,
                  })

                  const stored = await ipfs.upload({
                    data: encryptedFile,
                    name: fileObject.name,
                  })

                  console.log('stored hash', stored)
                  store.dispatch(
                    change('docForm', 'encryptedIpfsHash', stored[0].hash)
                  )

                  // const decryptedFile = await decryptFile({
                  //   encryptedData: encryptedFile,
                  //   password: secret,
                  // })

                  // const blob = new Blob([decryptedFile.buffer])
                  // saveAs(blob, 'decrypted.pdf')

                  // const encryptedFile = await encryptFile({
                  //   data: originalFileAsUint8Array,
                  //   password: secret,
                  // })
                  // console.log({ encryptedFile })
                  // console.log(encryptedFile.buffer)

                  // const data = Buffer.from(encryptedFile.buffer)
                  // console.log(data)

                  // const stored = await ipfs.store({ data })
                  // const hash = stored[0].hash
                  // console.log('stored hash', hash)

                  // const gotEncryptedFileBuffer = await ipfs.get({ hash })
                  // console.log(gotEncryptedFileBuffer)
                  // console.log(gotEncryptedFileBuffer.buffer)

                  // const decryptedFile = await decryptFile({
                  //   encryptedData: gotEncryptedFileBuffer,
                  //   password: secret,
                  // })

                  // const blob = new Blob([decryptedFile.buffer])
                  // saveAs(blob, 'decrypted.pdf')
                }
              })(fileObject)

              // Read in the image file as a data URL.
              reader.readAsArrayBuffer(fileObject)
            })
            field.input.onChange(fileObjects)
          }}
        >
          <div>
            {files.length ? (
              <div>
                <Preview
                  src={files[0].preview}
                  frameborder="0"
                  scrolling="no"
                />
              </div>
            ) : (
              <div>
                <Text>Drag and drop your document here</Text>
                <p>
                  <small>Only PDF accepted</small>
                </p>
              </div>
            )}
          </div>
        </DropArea>

        <small className="text-muted">{getFileName(files)}</small>
      </div>
    )
  }
}

//QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn
//QmeqsGH8mF8CRNZzpasxuCq7njtFKZYfhTvw6up8K4XpKj

// string _encryptedIpfsHash,
