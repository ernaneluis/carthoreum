import React from 'react'
import Dropzone from 'react-dropzone'
import Link from 'redux-first-router-link'
import styled from 'styled-components'
import DropZone from './DropZone'
import { Field } from 'redux-form'

const Welcome = ({ onSubmit }) => (
  <div className="container bg-light">
    <div className="row justify-content-center text-center mb-5">
      <div className="col-8">
        <h1>Ethereum Cartorio</h1>
      </div>
    </div>
    <div className="row justify-content-center text-center mb-5">
      <div className="col-10">
        <h4> notary online</h4>
        <form onSubmit={onSubmit}>
          <div className="row">
            <div className="col-12">
              <Field component={DropZone} name="doc" />
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
)

export default Welcome
