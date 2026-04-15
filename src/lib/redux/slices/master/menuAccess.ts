import { createSlice } from '@reduxjs/toolkit'

const initialState: {
  fetching: boolean,
  menuAccess: {
    id: number,
    role_id: number,
    menu: string,
    show: boolean,
    create: boolean,
    edit: boolean,
    delete: boolean,
    created_at: string,
    created_nik: number,
    created_by: string,
    updated_at: string,
    updated_nik: number,
    updated_by: string,
  }[],
  error?: any
} = {
  fetching: false,
  menuAccess: []
}

const menuAccess = createSlice({
  name: 'menuAccess',
  initialState: initialState,
  reducers: {
    requestMenuAccess: (state) => {
      state.fetching = true
      state.error = null

      return state
    },
    receiveMenuAccess: (state, action) => {
      state.menuAccess = action.payload
      state.fetching = false
      state.error = null

      return state
    },
    errorMenuAccess: (state, action) => {
      state.fetching = false
      state.error = action.payload

      return state
    }
  }
})

export const { requestMenuAccess, receiveMenuAccess, errorMenuAccess } = menuAccess.actions

export default menuAccess.reducer