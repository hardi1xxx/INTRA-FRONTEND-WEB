// import { errorNotifications, receiveNotifications, requestNotifications } from "@/lib/redux/slices/notifications"
// import { setTextNotification } from "@/lib/redux/slices/notification"
// import { getNotifications } from "@/lib/services"
// import { DataNotificationType } from "@/lib/services/notifications"
// import { errorHandler } from "../errorHandler"
// import { put, takeEvery } from "redux-saga/effects"
// import { GET_NOTIFICATIONS } from "@/lib/redux/types"

// export function* getNotificationsSagas() {
//   try {
//     yield put(requestNotifications())

//     const response: DataNotificationType = yield getNotifications()

//     yield put(receiveNotifications(response))
//   } catch (error: any) {
//     const { message, statusCode } = errorHandler(error)
//     yield put(errorNotifications(message))
//     yield put(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
//   }
// }

// export function* watchGetNotificationsAsync() {
//   yield takeEvery(GET_NOTIFICATIONS, getNotificationsSagas)
// }