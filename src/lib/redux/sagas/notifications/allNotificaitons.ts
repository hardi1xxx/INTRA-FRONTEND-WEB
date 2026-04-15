// import { errorNotifications, receiveNotifications, requestNotifications } from "@/lib/redux/slices/notifications"
// import { setTextNotification } from "@/lib/redux/slices/notification"
// import { getAllNotifications } from "@/lib/services"
// import { DataNotificationType, getAllNotificationsService } from "@/lib/services/notifications"
// import { errorHandler } from "../errorHandler"
// import { put, takeEvery } from "redux-saga/effects"
// import { ALL_NOTIFICATIONS } from "@/lib/redux/types"

// type AnyAction = {
//     type: string,
//     isAll: boolean
// }

// export function* allNotificationsSagas({ isAll }: AnyAction) {
//   try {
//     yield put(requestNotifications())

//     const response: DataNotificationType = yield getAllNotifications(isAll)

//     yield put(receiveNotifications(response))
//   } catch (error: any) {
//     const { message, statusCode } = errorHandler(error)
//     yield put(errorNotifications(message))
//     yield put(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
//   }
// }

// export function* watchAllNotificationsAsync() {
//   yield takeEvery(ALL_NOTIFICATIONS, allNotificationsSagas)
// }