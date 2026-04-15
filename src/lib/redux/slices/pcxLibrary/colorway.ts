import { DataUploadMasterColorwayResponseType } from "@/lib/services/pcx-library/colorway"
import { createSlice } from "@reduxjs/toolkit"

export type DataMasterColorway = {
    org_id?: string,
    colorway_id?: number,
    nike_colorway_id?: string,
    nike_colorway_code?: string,
    nike_colorway_name?: string,
    colorway_type?: string | null,
    colorway_status?: string,
    colorway_state?: string | null,
    user_id?: string,
    create_date?: string,
    last_update_by?: string,
    last_update_date?: string
}

export type DataColorwayIDMasterColorway = {
    colorway_id: string
}

export type DataNikeColorwayIDMasterColorway = {
    nike_colorway_id: string
}

export type DataNikeColorwayCodeMasterColorway = {
    nike_colorway_code: string
}

export type DataNikeColorwayNameMasterColorway = {
    nike_colorway_name: string
}

export type DataColorwayTypeMasterColorway = {
    colorway_type: string
}

export type DataColorwayStatusMasterColorway = {
    colorway_status: string
}

export type DataColorwayStateMasterColorway = {
    colorway_state: string
}

const initialState: {
    fetching: boolean,
    rows: DataMasterColorway[],
    error?: any,
    fetchingExport?: any,
    recordsTotal: number,
    params: {
        colorway_id: string | null,
        nike_colorway_id: string | null,
        nike_colorway_code: string | null,
        nike_colorway_name: string | null,
        colorway_type: string | null,
        colorway_status: string | null,
        colorway_state: string | null
    },
    colorwayID: DataColorwayIDMasterColorway[],
    fetchingColorwayID: boolean,
    nikeColorwayID: DataNikeColorwayIDMasterColorway[],
    fetchingNikeColorwayID: boolean,
    nikeColorwayCode: DataNikeColorwayCodeMasterColorway[],
    fetchingNikeColorwayCode: boolean,
    nikeColorwayName: DataNikeColorwayNameMasterColorway[],
    fetchingNikeColorwayName: boolean,
    colorwayType: DataColorwayTypeMasterColorway[],
    fetchingColorwayType: boolean,
    colorwayStatus: DataColorwayStatusMasterColorway[],
    fetchingColorwayStatus: boolean,
    colorwayState: DataColorwayStateMasterColorway[],
    fetchingColorwayState: boolean,
    fetchingUpload: boolean,
    uploadData: DataUploadMasterColorwayResponseType,
    fetchingDownloadTemplate: boolean,
} = {
    fetching: false,
    rows: [],
    fetchingExport: false,
    recordsTotal: 0,
    params: {
        colorway_id: null,
        nike_colorway_id: null,
        nike_colorway_code: null,
        nike_colorway_name: null,
        colorway_type: null,
        colorway_status: null,
        colorway_state: null
    },
    colorwayID: [],
    fetchingColorwayID: false,
    nikeColorwayID: [],
    fetchingNikeColorwayID: false,
    nikeColorwayCode: [],
    fetchingNikeColorwayCode: false,
    nikeColorwayName: [],
    fetchingNikeColorwayName: false,
    colorwayType: [],
    fetchingColorwayType: false,
    colorwayStatus: [],
    fetchingColorwayStatus: false,
    colorwayState: [],
    fetchingColorwayState: false,
    fetchingUpload: false,
    uploadData: {
        invalid: [],
        valid: [],
    },
    fetchingDownloadTemplate: false,
}

const pcxLibraryColorway = createSlice({
    name: "pcxLibraryColorway",
    initialState: initialState,
    reducers: {
        requestMasterColorway: (state) => {
            state.fetching = true
            state.error = null

            return state
        },
        receiveMasterColorway: (state, { payload }) => {
            state.rows = payload.data
            state.recordsTotal = payload.recordsFiltered
            state.params = payload.params
            state.fetching = false
            state.fetchingExport = false
            state.error = null

            return state
        },
        errorMasterColorway: (state, { payload }) => {
            state.fetching = false
            state.fetchingExport = false

            state.fetchingColorwayID = false
            state.fetchingNikeColorwayID = false
            state.fetchingNikeColorwayCode = false
            state.fetchingNikeColorwayName = false
            state.fetchingColorwayType = false
            state.fetchingColorwayStatus = false
            state.fetchingColorwayState = false

            state.uploadData = {
                valid: [],
                invalid: []
            }
            state.fetchingUpload = false
            state.fetchingDownloadTemplate = false

            state.error = payload

            return state
        },
        requestColorwayIDMasterColorway: (state) => {
            state.fetchingColorwayID = true
            state.error = null

            return state
        },
        receiveColorwayIDMasterColorway: (state, { payload }) => {
            state.fetchingColorwayID = false
            state.colorwayID = payload

            return state
        },
        requestNikeColorwayIDMasterColorway: (state) => {
            state.fetchingNikeColorwayID = true
            state.error = null

            return state
        },
        receiveNikeColorwayIDMasterColorway: (state, { payload }) => {
            state.fetchingNikeColorwayID = false
            state.nikeColorwayID = payload

            return state
        },
        requestNikeColorwayCodeMasterColorway: (state) => {
            state.fetchingNikeColorwayCode = true
            state.error = null

            return state
        },
        receiveNikeColorwayCodeMasterColorway: (state, { payload }) => {
            state.fetchingNikeColorwayCode = false
            state.nikeColorwayCode = payload

            return state
        },
        requestNikeColorwayNameMasterColorway: (state) => {
            state.fetchingNikeColorwayName = true
            state.error = null

            return state
        },
        receiveNikeColorwayNameMasterColorway: (state, { payload }) => {
            state.fetchingNikeColorwayName = false
            state.nikeColorwayName = payload

            return state
        },
        requestColorwayTypeMasterColorway: (state) => {
            state.fetchingColorwayType = true
            state.error = null

            return state
        },
        receiveColorwayTypeMasterColorway: (state, { payload }) => {
            state.fetchingColorwayType = false
            state.colorwayType = payload

            return state
        },
        requestColorwayStatusMasterColorway: (state) => {
            state.fetchingColorwayStatus = true
            state.error = null

            return state
        },
        receiveColorwayStatusMasterColorway: (state, { payload }) => {
            state.fetchingColorwayStatus = false
            state.colorwayStatus = payload

            return state
        },
        requestColorwayStateMasterColorway: (state) => {
            state.fetchingColorwayState = true
            state.error = null

            return state
        },
        receiveColorwayStateMasterColorway: (state, { payload }) => {
            state.fetchingColorwayState = false
            state.colorwayState = payload

            return state
        },
        requestExportMasterColorway: (state) => {
            state.fetchingExport = true
            state.error = null

            return state
        },
        receiveExportMasterColorway: (state) => {
            state.fetchingExport = false
            state.error = null

            return state
        },
        requestUploadMasterColorway: (state) => {
            state.fetchingUpload = true
            state.error = null

            return state
        },
        receiveUploadMasterColorway: (state, { payload }) => {
            state.fetchingUpload = false
            state.uploadData = payload

            return state
        },
        requestDownloadTemplateMasterColorway: (state) => {
            state.fetchingDownloadTemplate = true
            state.error = null

            return state
        },
        receiveDownloadTemplateMasterColorway: (state) => {
            state.fetchingDownloadTemplate = false
            
            return state
        },
    }
})

export const {
    requestMasterColorway,
    receiveMasterColorway,
    errorMasterColorway,
    requestExportMasterColorway,
    receiveExportMasterColorway,
    requestColorwayIDMasterColorway,
    receiveColorwayIDMasterColorway,
    requestNikeColorwayIDMasterColorway,
    receiveNikeColorwayIDMasterColorway,
    requestNikeColorwayCodeMasterColorway,
    receiveNikeColorwayCodeMasterColorway,
    requestNikeColorwayNameMasterColorway,
    receiveNikeColorwayNameMasterColorway,
    requestColorwayTypeMasterColorway,
    receiveColorwayTypeMasterColorway,
    requestColorwayStatusMasterColorway,
    receiveColorwayStatusMasterColorway,
    requestColorwayStateMasterColorway,
    receiveColorwayStateMasterColorway,
    requestUploadMasterColorway,
    receiveUploadMasterColorway,
    requestDownloadTemplateMasterColorway,
    receiveDownloadTemplateMasterColorway,
} = pcxLibraryColorway.actions

export default pcxLibraryColorway.reducer