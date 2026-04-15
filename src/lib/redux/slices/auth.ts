import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import { getCookie } from 'cookies-next'


const initialState : {
    fetching: boolean,
    auth: {
        name?: string,
        nik? : string,
        role?: string,
        picture? : string,
        menu_access: string
    },
    error? : any
} = {
    fetching: false,
    auth: {
        name: getCookie('intra_auth_name') || '',
        nik: getCookie('intra_auth_nik') || '',
        role: getCookie('intra_auth_role') || '',
        picture: getCookie('intra_auth_picture') || '',
        menu_access: getCookie('intra_auth_menu_access') || ''
    }
}

const auth = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        requestChangeProfilePicture: (state) => {
            state.fetching = true

            return state
        },
        receiveChangeProfilePicture: (state,action) => {
            state.fetching = false
            state.auth = {
                ...state.auth,
                picture: action.payload
            }

            return state
        },
        errorChangeProfilePicture: (state,action) => {
            state.fetching = false
            state.error = action.payload

            return state
        },
        requestChangePassword: (state) => {
            state.fetching = true

            return state
        },
        receiveChangePassword: (state) => {
            state.fetching = false

            return state
        },
        errorChangePassword: (state,action) => {
            state.fetching = false
            state.error = action.payload

            return state
        },
        requestAuth: (state) => {
            state.fetching = true
            state.auth = {
                name: '',
                nik: '',
                role: '',
                picture: '',
                menu_access: '',
            }
            delete state.error

            return state
        },
        receiveAuth: (state, action) => {
            // state.fetching = false
            state.auth = action.payload
            delete state.error

            return state
        },
        setAuthFetching: (state, action: PayloadAction<boolean>) => {
            state.fetching = action.payload

            return state
        },
        errorAuth: (state, action) => {
            state.fetching = false
            state.auth = {
                name: '',
                nik: '',
                role: '',
                picture: '',
                menu_access: '',
            }
            state.error = action.payload

            return state
        }
    }
})

export const {
    requestAuth,
    receiveAuth,
    errorAuth,
    requestChangePassword,
    receiveChangePassword,
    errorChangePassword,
    requestChangeProfilePicture,
    receiveChangeProfilePicture,
    errorChangeProfilePicture,
    setAuthFetching,
} = auth.actions

export default auth.reducer