import { createSlice } from "@reduxjs/toolkit"

const initialState: {
  fetching: boolean,
  rows: {
    id: number,
    name: string,
    nik: string,
    email: string,
    role_id: number,
    picture: string,
    created_at: string
    created_nik: number
    created_by: string
    updated_at: string
    updated_nik: number
    updated_by: string,
    no: number,
  }[],
  error?: any,
  fetchingExport: boolean,
} = {
  fetching: false,
  rows: [],
  fetchingExport: false,
}

const user = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    requestUser: (state) => {
      state.fetching = true
      state.error = null

      return state
    },
    receiveUser: (state, action) => {
      state.fetching = false
      state.fetchingExport = false
      state.rows = action.payload

      return state
    },
    errorUser: (state, action) => {
      state.fetching = false
      state.fetchingExport = false
      state.error = action.payload

      return state
    },
    requestExportUser: (state) => {
      state.fetchingExport = true
      state.error = null

      return state
    },
    receiveExportUser: (state) => {
      state.fetchingExport = false
      state.error = null

      return state
    }
  }
})

export const { requestUser, receiveUser, errorUser, requestExportUser, receiveExportUser } = user.actions

export default user.reducer