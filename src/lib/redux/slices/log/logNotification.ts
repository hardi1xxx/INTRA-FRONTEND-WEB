import { GetLogNotificationDataResponse } from "@/lib/services/log-notification"
import { createSlice } from "@reduxjs/toolkit"

const initialState: {
    fetching: boolean,
    fetchingExport: boolean
    param: {
        start_date?: string,
        end_date?: string,
        order?: string,
        search?: string,
        start: number,
        length: number
    },
    logNotification: GetLogNotificationDataResponse,
    error?: any
} = {
    fetching: false,
    fetchingExport: false,
    param: {
        start: 0,
        length: 5
    },
    logNotification: {
        search: null,
        date_start: null,
        date_end: null,
        data: [],
        draw: null,
        recordsTotal: null,
        recordsFiltered: null
    }
}

const logNotification = createSlice({
    name: 'logNotification',
    initialState: initialState,
    reducers: {
        requestLogNotification: (state) => {
            state.fetching = true
            state.error = null

            return state
        },
        receiveLogNotification: (state, action) => {
            state.logNotification = action.payload.result
            state.param = action.payload.param
            state.fetching = false
            state.error = null

            return state
        },
        errorLogNotification: (state, action) => {
            state.logNotification = {
                search: null,
                date_start: null,
                date_end: null,
                data: [],
                draw: null,
                recordsTotal: null,
                recordsFiltered: null
            }
            state.fetching = false
            state.fetchingExport = false
            state.error = action.payload

            return state
        },
        requestExportLogNotification: (state) => {
            state.fetchingExport = true
            state.error = null

            return state
        },
        receiveExportLogNotification: (state) => {
            state.fetchingExport = false
            state.error = null

            return state
        }
    }
})

export const { requestLogNotification, receiveLogNotification, errorLogNotification, requestExportLogNotification, receiveExportLogNotification } = logNotification.actions

export default logNotification.reducer