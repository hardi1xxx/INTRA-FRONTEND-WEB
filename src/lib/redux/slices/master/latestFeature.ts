import { GetLatestFeatureRequestType, LatestFeatureResponseType } from "@/lib/services/master/latestFeature";
import { createSlice } from "@reduxjs/toolkit";

const initialState: {
    fetching: boolean,
    rows: LatestFeatureResponseType[],
    error?: any,
    fetchingExport: boolean,
    params: GetLatestFeatureRequestType,
    recordsTotal: number,
} = {
    fetching: false,
    rows: [],
    fetchingExport: false,
    params: {
        column: '',
        start: 0,
        length: 10,
        start_date: '',
        end_date: '',
        search: '',
        filter_param: '',
        order_param: '',
    },
    recordsTotal: 0,
}

const latestFeature = createSlice({
    name: "latestFeature",
    initialState: initialState,
    reducers: {
        requestLatestFeature: (state) => {
            state.fetching = true
            state.error = null

            return state
        },
        receiveLatestFeature: (state, { payload }) => {
            state.rows = payload.data ?? []
            state.recordsTotal = payload.recordsFiltered ?? 0
            state.params = payload.params
            state.fetching = false

            return state
        },
        errorLatestFeature: (state, { payload }) => {
            state.fetching = false
            state.fetchingExport = false
            state.error = payload

            return state
        },
        requestExportLatestFeature: (state) => {
            state.fetchingExport = true
            state.error = null

            return state
        },
        receiveExportLatestFeature: (state) => {
            state.fetchingExport = false
            state.error = null

            return state
        }
    }
})

export const {
    requestLatestFeature,
    receiveLatestFeature,
    errorLatestFeature,
    requestExportLatestFeature,
    receiveExportLatestFeature,
} = latestFeature.actions

export default latestFeature.reducer