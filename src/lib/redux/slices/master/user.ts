import { createSlice } from "@reduxjs/toolkit"

export type DataUser = {
    id?: number,
    name?: string,
    nik?: string,
    picture?: string,
    role_id?: string,
    role_name?: string,
    departement_user_id?: string,
    departement_user_name?: string,
    departement_name?: string,
    job_position_id?: string,
    job_position_name?: string,
    email?: string,
    phone_number?: string,
    picture_sign?: string,
    created_at?: string,
    created_by?: string,
    updated_at?: string,
    updated_by?: string,
    created_nik?: string,
    updated_nik?: string,
    is_app?: string,
    is_web?: string,
}

export type DataDropdownUser = {
    name?: string,
    nik?: string,
    role?: string,
    departement?: string,
}

export type FilterParamsUser = {
    type: "table" | "dropdown",
    column?: string,
    filter_param?: string,
    order_param?: string,
    start?: number,
    length?: number,
    search?: string,
}

const initialState: {
    fetching: boolean,
    rows: DataUser[],
    user?: DataUser,
    error?: any,
    fetchingExport: boolean,
    recordsTotal: number,
    params: FilterParamsUser,
    formErrorsUser: { [key: string]: string }[],
    fetchingDetail: boolean,
} = {
    fetching: false,
    rows: [],
    fetchingExport: false,
    recordsTotal: 0,
    params: {
        type: "table",
        column: "",
        filter_param: "",
        order_param: "",
        start: 0,
        length: 10,
        search: "",
    },
    formErrorsUser: [],
    fetchingDetail: false,
}

// rate name slices & reducer
const user = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        errorUser: (state, { payload }) => {
            state.fetching = false
            state.fetchingExport = false

            state.error = payload
        },
        requestUser: (state) => {
            state.fetching = true
            state.error = null

            return state
        },
        receiveUser: (state, { payload }) => {
            state.fetching = false
            state.error = null

            state.rows = payload.data ?? []
            state.recordsTotal = payload.recordsFiltered ?? 0
            state.params = payload.params

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
        },
        setFormErrorsUser: (state, { payload }) => {
            state.formErrorsUser = payload
            state.fetching = false

            return state
        },
        requestUserDetail: (state) => {
            state.fetchingDetail = true
            state.error = null

            return state
        },
        receiveUserDetail: (state, { payload }) => {
            state.fetchingDetail = false
            state.error = null

            state.user = payload

            return state
        }
    }
})

export const {
    errorUser,
    requestUser,
    receiveUser,
    requestExportUser,
    receiveExportUser,
    setFormErrorsUser,
    receiveUserDetail,
    requestUserDetail,
} = user.actions

export default user.reducer