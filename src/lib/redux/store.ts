import auth from "@/lib/redux/slices/auth";
import customization from "@/lib/redux/slices/customization";
import notification from "@/lib/redux/slices/notification";
import createSagaMiddleware from "@redux-saga/core";
import { configureStore } from "@reduxjs/toolkit";

// redux master
import departementUser from "@/lib/redux/slices/master/departementUser";
import jobPosition from "@/lib/redux/slices/master/job-position";
import latestFeature from "@/lib/redux/slices/master/latestFeature";
import menuAccess from "@/lib/redux/slices/master/menuAccess";
import menuAccessMobile from "@/lib/redux/slices/master/menuAccessMobile";
import role from "@/lib/redux/slices/master/role";
import shift from "@/lib/redux/slices/master/shift";
import user from "@/lib/redux/slices/master/user";

// redux log
import logActivity from "./slices/log/logActivity";

// log notification
import logNotification from "./slices/log/logNotification";

// system update
import systemUpdate from "./slices/systemUpdate";

// redux notifications
import notifications from "./slices/notifications";

// Report PT3
import reportPT3 from "@/lib/redux/slices/report/reportPT3";

import { rootSaga } from "./sagas";

const sagaMiddleware = createSagaMiddleware();
const store = configureStore({
  reducer: {
    customization,
    notification,
    auth,

    departementUser,
    shift,

    // Setting
    role,
    menuAccess,
    user,
    jobPosition,
    latestFeature,
    menuAccessMobile,

    // log
    logActivity,

    // log notification
    logNotification,

    // system update
    systemUpdate,

    //notifications
    notifications,

    // Report PT3
    reportPT3,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: false, serializableCheck: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type AppStore = ReturnType<() => typeof store>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = AppStore["dispatch"];
export default store;
