// import { errorNotifications, receiveNotifications, requestNotifications } from "@/lib/redux/slices/notifications"
// import { setTextNotification } from "@/lib/redux/slices/notification"
// import { getUnreadNotifications, readNotifications } from "@/lib/services"
// import { DataNotificationType } from "@/lib/services/notifications"
// import { errorHandler } from "../errorHandler"
// import { put, takeEvery } from "redux-saga/effects"
// import { READ_NOTIFICATIONS } from "@/lib/redux/types"

// export function* readNotificationsSagas() {
//   try {
//     yield put(requestNotifications())

//     yield readNotifications()

//     const response: DataNotificationType = yield getUnreadNotifications()

//     yield put(receiveNotifications(response))
//   } catch (error: any) {
//     const { message, statusCode } = errorHandler(error)
//     yield put(errorNotifications(message))
//     yield put(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
//   }
// }

// export function* watchReadNotificationsAsync() {
//   yield takeEvery(READ_NOTIFICATIONS, readNotificationsSagas)
// }