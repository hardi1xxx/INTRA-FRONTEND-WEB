import {createSlice} from '@reduxjs/toolkit'

const initialState : {
    fetching: boolean,
    role: {
        id: number,
        role: string
        created_at: string,
        created_nik: number,
        created_by: string,
        updated_at: string,
        updated_nik: number,
        updated_by: string,
    }[],
    error? : any
} = {
    fetching: false,
    role: []
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
        receiveRole: (state,action) => {
            state.role = action.payload
            state.fetching = false
            state.error = null

            return state
        },
        errorRole: (state,action) => {
            state.role = []
            state.fetching = false
            state.error = action.payload

            return state
        },
    }
})

export const {requestRole, receiveRole, errorRole} = role.actions

export default role.reducer