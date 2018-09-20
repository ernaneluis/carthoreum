import React from 'react'
import Link from 'redux-first-router-link'
import styled from 'styled-components'
import classnames from 'classnames'
import { Field, FieldArray } from 'redux-form'
import { Button, ButtonGroup } from 'reactstrap'

import DropZone from './DropZone'

const RenderField = ({ input, meta, ...ownProps }) => (
  <div>
    <input {...input} {...ownProps} />
    {meta.touched && meta.error && <span className="error">{meta.error}</span>}
  </div>
)

const renderSigner = ({ fields }) => (
  <div>
    <h4 className="d-flex justify-content-between align-items-center mb-3">
      <span className="text-muted">
        Who needs to sign?{' '}
        <span className="badge badge-secondary badge-pill">
          {fields.length}
          /10
        </span>
      </span>
      <button
        className="btn btn-success"
        type="button"
        onClick={() => fields.push()}
      >
        Add Signer
      </button>
    </h4>
    <small className="text-muted">
      Add the email address and Ethereum address of each person that needs to
      sign and receive access to the document.
    </small>

    <ul className="list-group mb-3">
      {fields.map((field, index) => (
        <li
          key={field}
          className={classnames(
            ['list-group-item'],
            !!(index % 2) ? 'bg-light' : ''
          )}
        >
          <div className="d-flex justify-content-between mb-2">
            <label className="col-form-label">
              <strong>Signer #{index + 1}</strong>
            </label>
          </div>
          <div className="form-group row mb-3">
            <div className="col-sm-12">
              <Field
                name={`${field}email`}
                placeholder="Email: you@example.com"
                type="email"
                component={RenderField}
                className="form-control form-control-sm"
              />
            </div>
          </div>

          <div className="form-group row mb-3">
            <div className="col-sm-12">
              <Field
                className="form-control form-control-sm"
                name={`${field}ethereumAddress`}
                placeholder="Ethereum Address: 0x..."
                type="text"
                component={RenderField}
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
)

const Welcome = ({ onSubmit }) => (
  <div className="container bg-light">
    <div className="row justify-content-center text-center mb-5">
      <div className="col-8">
        <h1>Carthoreum - Unstoppable Notary</h1>
        <h4>Sign documents Easy, Secure, and Forever Lasting.</h4>
      </div>
    </div>

    <form onSubmit={onSubmit} className="row  text-left mt-5">
      <div className="col-md-7 order-md-1">
        <FieldArray name="signers" component={renderSigner} />
      </div>

      <div className="col-md-5 order-md-2 mb-4">
        <p>
          Select a document and have it certified in the Ethereum Blockchain
        </p>

        <div className="row">
          <div className="col-12">
            <Field component={DropZone} name="doc" />
            <small>
              If it has been certified already, you will be redirected to the
              original record. You can also input a hash to find previous
              records.
            </small>
          </div>
        </div>

        <hr className="mb-4" />
        <button className="btn btn-primary btn-lg btn-block" type="submit">
          Register the document
        </button>
      </div>
    </form>
  </div>
)

export default Welcome
