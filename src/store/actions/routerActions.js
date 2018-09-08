import { isEmpty } from 'lodash'

export const toWelcome = () => ({ type: 'WELCOME' })

export const toPrevious = state =>
  isEmpty(state.location.prev.type)
    ? toWelcome()
    : { type: state.location.prev.type }
