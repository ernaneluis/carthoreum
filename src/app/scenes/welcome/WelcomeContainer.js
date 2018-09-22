import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import Welcome from './Welcome'

import { createDocument } from '../../../store/actions/welcomeActions'

const mapStateToProps = ({
  ui: { ipfsUploadProgress, encryptingProgress },
}) => ({
  ipfsUploadProgress,
  encryptingProgress,
})

const mapDispatchToProps = dispatch => ({
  dispatch,
})

const mergeProps = (
  { ...stateProps },
  { dispatch },
  { handleSubmit, ...ownProps }
) => ({
  ...stateProps,
  ...ownProps,
  onSubmit: handleSubmit(values => dispatch(createDocument(values))),
})

export default reduxForm({
  form: 'docForm',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Welcome)
)
