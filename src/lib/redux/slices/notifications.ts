import { DataNotificationType } from '@/lib/services/notifications'
import {createSlice} from '@reduxjs/toolkit'


const initialState : {
    fetching: boolean,
    notifications: DataNotificationType[],
    error?: any
} = {
    fetching: false,
    notifications: []
}

const notifications = createSlice({
    name: 'notifications',
    initialState: initialState,
    reducers: {
        requestNotifications: (state) => {
            state.fetching = true
            state.error = null
      
            return state
          },
          receiveNotifications: (state, action) => {
            state.fetching = false
            state.notifications = action.payload
      
            return state
          },
          errorNotifications: (state, action) => {
            state.fetching = false
            state.error = action.payload
      
            return state
          },
    }
})

export const {requestNotifications,receiveNotifications,errorNotifications} = notifications.actions

export default notifications.reducer