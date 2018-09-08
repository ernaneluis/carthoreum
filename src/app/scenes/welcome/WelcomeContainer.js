import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import Welcome from './Welcome'

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
  dispatch,
})

export default reduxForm({
  form: 'docForm',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Welcome)
)
