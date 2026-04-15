import {createSlice} from '@reduxjs/toolkit'


const initialState : {
    text: string | undefined,
    severity: 'error' | 'info' | 'success' | 'warning' | undefined,
    responseCode: number | undefined
} = {
    text: '',
    severity: undefined,
    responseCode: undefined
}

const notification = createSlice({
    name: 'notification',
    initialState: initialState,
    reducers: {
        setTextNotification: (state,action) => {
            state.text = action.payload.text
            state.severity = action.payload.severity
            state.responseCode = action.payload.responseCode ? action.payload.responseCode : 200

            return state
        },
    }
})

export const {setTextNotification} = notification.actions

export default notification.reducer