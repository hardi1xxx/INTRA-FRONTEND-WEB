import {createSlice} from '@reduxjs/toolkit'
import config from '@/components/config';

export type CustomizationType = {
    isOpen: string[], // for active default menu
    defaultId: string,
    fontFamily: string,
    borderRadius: number,
    opened: true
}

const initialState : CustomizationType = {
    isOpen: [], // for active default menu
    defaultId: 'default',
    fontFamily: config.fontFamily,
    borderRadius: config.borderRadius,
    opened: true
}

const notification = createSlice({
    name: 'notification',
    initialState: initialState,
    reducers: {
        menuOpen: (state,action) => {
            state.isOpen = [action.payload]

            return state
        },
        setMenu: (state,action) => {
            state.opened = action.payload

            return state
        },
        setFontFamily: (state,action) => {
            state.fontFamily = action.payload

            return state
        },
        setBorderRadius: (state,action) => {
            state.borderRadius = action.payload

            return state
        },
    }
})

export const {menuOpen, setMenu, setFontFamily, setBorderRadius} = notification.actions

export default notification.reducer