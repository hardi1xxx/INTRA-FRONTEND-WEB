import { createSlice } from "@reduxjs/toolkit"

export type DataMenuAccessMobile = {
    id?: number,
    menu?: string
    created_at?: string,
    created_nik?: number,
    created_by?: string,
    updated_at?: string,
    updated_nik?: number,
    updated_by?: string,
}

const initialState: {
    fetching: boolean,
    rows: DataMenuAccessMobile[],
    error?: any,
    fetchingExport: boolean,
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
} = {
    fetching: false,
    rows: [],
    fetchingExport: false,
    menuAccess: [],
}

const menuAccessMobile = createSlice({
    name: 'menuAccessMobile',
    initialState: initialState,
    reducers: {
        requestMenuAccessMobile: (state) => {
            state.fetching = true
            state.error = null

            return state
        },
        receiveMenuAccessMobile: (state, action) => {
            state.rows = action.payload ?? []
            state.fetching = false
            state.fetchingExport = false
            state.error = null

            return state
        },
        receiveMenuAccessMobileByRole: (state, action) => {
            state.menuAccess = action.payload ?? []
            state.fetching = false
            state.fetchingExport = false
            state.error = null

            return state
        },
        errorMenuAccessMobile: (state, action) => {
            state.rows = []
            state.menuAccess = []
            state.fetching = false
            state.error = action.payload

            return state
        },
        requestExportMenuAccessMobile: (state) => {
            state.fetchingExport = true
            state.error = null

            return state
        },
        receiveExportMenuAccessMobile: (state) => {
            state.fetchingExport = false

            return state
        }
    }
})

export const {
    requestMenuAccessMobile,
    receiveMenuAccessMobile,
    receiveMenuAccessMobileByRole,
    errorMenuAccessMobile,
    requestExportMenuAccessMobile,
    receiveExportMenuAccessMobile,
} = menuAccessMobile.actions

export default menuAccessMobile.reducer