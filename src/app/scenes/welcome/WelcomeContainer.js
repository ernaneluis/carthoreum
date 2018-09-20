import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import Welcome from './Welcome'

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
  dispatch,
})

const mergeProps = (
  { isSubmitting },
  { dispatch },
  { handleSubmit, ...ownProps }
) => ({
  ...ownProps,
  isSubmitting,
  onSubmit: handleSubmit(values => dispatch()),
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
