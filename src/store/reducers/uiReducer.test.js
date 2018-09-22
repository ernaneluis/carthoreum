import reducer from './uiReducer'
import * as types from '../typesReducers'

describe(`on ${types.SET_IPFS_UPLOAD_PROGRESS}`, () => {
  it('changes ipfs upload progressvalue', () => {
    const state = {
      a: 'a',
      ipfsUploadProgress: 0,
    }

    const action = {
      type: types.SET_IPFS_UPLOAD_PROGRESS,
      payload: { progress: 10 },
    }

    const expected = {
      a: 'a',
      ipfsUploadProgress: 10,
    }

    expect(reducer(state, action)).toEqual(expected)

    const action2 = {
      type: types.SET_IPFS_UPLOAD_PROGRESS,
      payload: { progress: 100 },
    }

    const expected2 = {
      a: 'a',
      ipfsUploadProgress: 100,
    }

    expect(reducer(state, action2)).toEqual(expected2)
  })
})
