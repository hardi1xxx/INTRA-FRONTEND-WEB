import { createSlice } from '@reduxjs/toolkit'

export type DataRole = {
    id?: number,
    role?: string
    created_at?: string,
    created_nik?: number,
    created_by?: string,
    updated_at?: string,
    updated_nik?: number,
    updated_by?: string,
}

const initialState: {
    fetching: boolean,
    role: DataRole[],
    error?: any,
    fetchingExport: boolean,
} = {
    fetching: false,
    role: [],
    fetchingExport: false,
}

const role = createSlice({
    name: 'role',
    initialState: initialState,
    reducers: {
        requestRole: (state) => {
            state.fetching = true
            state.error = null

            return state
        },
        receiveRole: (state, action) => {
            state.role = action.payload
            state.fetching = false
            state.fetchingExport = false
            state.error = null

            return state
        },
        errorRole: (state, action) => {
            state.role = []
            state.fetching = false
            state.error = action.payload

            return state
        },
        requestExportRole: (state) => {
            state.fetchingExport = true
            state.error = null

            return state
        },
        receiveExportRole: (state) => {
            state.fetchingExport = false

            return state
        }
    }
})

export const { requestRole, receiveRole, errorRole, requestExportRole, receiveExportRole } = role.actions

export default role.reducer