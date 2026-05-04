import auth from "@/lib/redux/slices/auth";
import customization from "@/lib/redux/slices/customization";
import notification from "@/lib/redux/slices/notification";
import createSagaMiddleware from "@redux-saga/core";
import { configureStore } from "@reduxjs/toolkit";

// redux master
import batch from "./slices/master/batch";
import categoryProject from "./slices/master/categoryProject";
import statusProject from "./slices/master/statusProject";
import mitra from "./slices/master/mitra";
import regional from "./slices/master/regional";
import area from "./slices/master/area";
import branch from "./slices/master/branch";
import sto from "./slices/master/sto";

// redux log
import logActivity from "./slices/log/logActivity";

// log notification
import logNotification from "./slices/log/logNotification";

// system update
import systemUpdate from "./slices/systemUpdate";

// redux notifications
import notifications from "./slices/notifications";

// transaction
import transactionDeployment from "./slices/transaction/transactionDeployment";

// report
import reportDeployment from "./slices/report/reportDeployment";

import { rootSaga } from "./sagas";

const sagaMiddleware = createSagaMiddleware();
const store = configureStore({
  reducer: {
    customization,
    notification,
    auth,

    // Master
    batch,
    categoryProject,
    statusProject,
    mitra,
    regional,
    area,
    branch,
    sto,

    // log
    logActivity,

    // log notification
    logNotification,

    // system update
    systemUpdate,

    //notifications
    notifications,

    // Transaction
    transactionDeployment,

    // Report PT3
    reportDeployment,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: false, serializableCheck: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type AppStore = ReturnType<() => typeof store>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = AppStore["dispatch"];
export default store;
