import createSagaMiddleware from "@redux-saga/core";
import { configureStore } from "@reduxjs/toolkit";
import customization from '@/lib/redux/slices/customization';
import notification from '@/lib/redux/slices/notification';
import auth from '@/lib/redux/slices/auth';

// redux master
import role from '@/lib/redux/slices/master/role'
import menuAccess from '@/lib/redux/slices/master/menuAccess'
import user from '@/lib/redux/slices/master/user'
import latestFeature from '@/lib/redux/slices/master/latestFeature'

// redux master pcx library
import pcxLibraryColorway from '@/lib/redux/slices/pcxLibrary/colorway'

// redux log
import logActivity from "./slices/log/logActivity";

// system update
import systemUpdate from "./slices/systemUpdate";

// redux notifications
import notifications from './slices/notifications'

import { rootSaga } from "./sagas";

const sagaMiddleware = createSagaMiddleware()
const store = configureStore({
    reducer: {
        customization,
        notification,
        auth,
        role,
        menuAccess,
        user,
        latestFeature,
        // log
        logActivity,

        // system update
        systemUpdate,

        //notifications
        notifications,

        // master pcx library
        pcxLibraryColorway,

    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: false, serializableCheck: false, }).concat(sagaMiddleware)
})

sagaMiddleware.run(rootSaga)

export type AppStore = ReturnType<() => typeof store>
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = AppStore['dispatch']
export default store
