import { GetLogActivityDataResponse } from '@/lib/services/log-activity'
import {createSlice} from '@reduxjs/toolkit'

const initialState : {
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
    logActivity: GetLogActivityDataResponse,
    error? : any
} = {
    fetching: false,
    fetchingExport: false,
    param: {
        start: 0,
        length: 10
    },
    logActivity: {
        search: null,
        start_date: null,
        end_date: null,
        data: [],
        draw: null,
        recordsTotal: null,
        recordsFiltered: null
    }
}

const logActivity = createSlice({
    name: 'logActivity',
    initialState: initialState,
    reducers: {
        requestLogActivity: (state) => {
            state.fetching = true
            state.error = null

            return state
        },
        receiveLogActivity: (state,action) => {
            state.logActivity = action.payload.result
            state.param = action.payload.param
            state.fetching = false
            state.error = null

            return state
        },
        errorLogActivity: (state,action) => {
            state.logActivity = {
                search: null,
                start_date: null,
                end_date: null,
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
        requestExportLogActivity: (state) => {
            state.fetchingExport = true
            state.error = null

            return state
        },
        receiveExportLogActivity: (state) => {
            state.fetchingExport = false
            state.error = null

            return state
        }
    }
})

export const {requestLogActivity, receiveLogActivity, errorLogActivity, requestExportLogActivity, receiveExportLogActivity} = logActivity.actions

export default logActivity.reducer