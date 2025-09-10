import { createSlice } from "@reduxjs/toolkit"

const initialState: {
    results: {
        date_update: string,
        modul: string,
        keterangan: string
    }[],
    fetching: boolean,
    error?: any
} = {
    results: [],
    fetching: false,
}

const systemUpdate = createSlice({
    name: 'systemUpdate',
    initialState: initialState,
    reducers: {
        requestSystemUpdate: (state) => {
            state.fetching = true
            state.error = null

            return state
        },
        receiveSystemUpdate: (state, { payload }) => {
            state.fetching = false
            state.results = payload

            return state
        },
        errorSystemUpdate: (state, { payload }) => {
            state.fetching = false
            state.error = payload
            state.results = []

            return state
        }
    }
})

export const { requestSystemUpdate, receiveSystemUpdate, errorSystemUpdate } = systemUpdate.actions

export default systemUpdate.reducer