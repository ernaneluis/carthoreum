import { connect } from 'react-redux'

import Body from './Body'

const mapStateToProps = state => ({
  scene: state.location.type,
})

const mapDispatchToProps = dispatch => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Body)
