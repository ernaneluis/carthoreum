import { EventEmitter } from 'events'
import Dropzone from 'react-dropzone'
import React from 'react'
import styled from 'styled-components'
import { Progress } from 'reactstrap'

import { saveAs } from 'file-saver/FileSaver'

import { encryptFile, createSharedKey, decryptFile } from '../../lib/encryption'

import * as ipfs from '../../lib/ipfs'

const StyledDropZone = styled(Dropzone)`
  align-items: center;
  border-radius: 4px;
  border: 2px dashed grey;
  cursor: pointer;
  display: flex;
  justify-content: center;
  min-height: 345px;
  padding: 3vw;
  text-align: center;
  margin-bottom: 20px;
  img {
    max-width: 100%;
  }
`

const CloudIcon = styled(({ className }) => (
  <svg
    className={className}
    role="img"
    viewBox="0 0 640 512"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M640 352c0 70.692-57.308 128-128 128H144C64.471 480 0 415.529 0 336c0-62.773 40.171-116.155 96.204-135.867A163.68 163.68 0 0 1 96 192c0-88.366 71.634-160 160-160 59.288 0 111.042 32.248 138.684 80.159C409.935 101.954 428.271 96 448 96c53.019 0 96 42.981 96 96 0 12.184-2.275 23.836-6.415 34.56C596.017 238.414 640 290.07 640 352zm-235.314-91.314L299.314 155.314c-6.248-6.248-16.379-6.248-22.627 0L171.314 260.686c-10.08 10.08-2.941 27.314 11.313 27.314H248v112c0 8.837 7.164 16 16 16h48c8.836 0 16-7.163 16-16V288h65.373c14.254 0 21.393-17.234 11.313-27.314z" />
  </svg>
))`
  max-width: 80px;
  path {
    fill: grey;
  }
`

const Title = styled.h3`
  color: grey;
  font-size: 1.1rem;
  font-weight: 900;
  margin: 0 0 35px 0;
`

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = { progress: 0 }
  }

  componentDidMount() {
    // we nead to clear the input on page reload
    // because the file objects get lost from browser memory
    this.props.input.onChange(null)
  }

  render() {
    ipfs.init()
    const field = this.props
    const files = field.input.value || []

    return (
      <div>
        <Progress animated value={this.state.progress.toFixed(2)}>
          {this.state.progress.toFixed(2)}
        </Progress>
        <StyledDropZone
          accept="application/pdf"
          name={field.name}
          multiple={false}
          onDrop={(accepted, rejected) => {
            const fileObjects = accepted
            fileObjects.forEach(fileObject => {
              if (!fileObject || fileObject.size > 5 * 1024 * 1024) {
                alert('Only .pdf files under 5MB are accepted.')
                return
              }

              var reader = new FileReader()
              // Closure to capture the file information.
              reader.onload = (theFile => {
                return async e => {
                  const sharedKey = createSharedKey().toString('hex')
                  // Render thumbnail.
                  //base64 fiel format
                  const arrayBuffer = e.target.result
                  const fileAsUint8Array = new Uint8Array(arrayBuffer)
                  let encryptedFile

                  const total = fileAsUint8Array.length * 1.2
                  let done = 0

                  encryptFile({
                    data: fileAsUint8Array,
                    password: sharedKey,
                  })
                    .on('encrypting', chuck => {
                      const progress = (done / total) * 100
                      this.setState({ progress })
                      console.log('progress: ', progress)
                      done += chuck.length
                    })
                    .on('done', async result => {
                      this.setState({ progress: 100 })
                      encryptedFile = result
                      console.log('done: ', { encryptedFile })

                      const decryptedFile = await decryptFile({
                        encryptedData: encryptedFile,
                        password: sharedKey,
                      })

                      const blob = new Blob([decryptedFile.buffer])
                      saveAs(blob, 'decrypted.pdf')
                    })

                  // const encryptedFile = await encryptFile({
                  //   data: fileAsUint8Array,
                  //   password: sharedKey,
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
                  //   password: sharedKey,
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
              files.map((file, i) => (
                <div key={i}>
                  {file.type === 'application/pdf' ? (
                    <div>
                      <i className="icon-file-pdf" />
                      <p>{file.name}</p>
                      {!file.isFromBackend && <strong>OK</strong>}

                      {file.isFromBackend && (
                        <div>
                          <p>
                            You already submitted a document. <br />
                            Drop file here or click to upload new version.
                          </p>
                          <p className="small">Only .pdf files are accepted.</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <img alt="preview" src={file.preview} />
                  )}
                </div>
              ))
            ) : (
              <div>
                <Title>
                  Drop file here or click to upload.
                  <p className="small">Only .pdf files are accepted.</p>
                </Title>
                <CloudIcon />
              </div>
            )}
          </div>
        </StyledDropZone>
      </div>
    )
  }
}

//QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn
//QmeqsGH8mF8CRNZzpasxuCq7njtFKZYfhTvw6up8K4XpKj
