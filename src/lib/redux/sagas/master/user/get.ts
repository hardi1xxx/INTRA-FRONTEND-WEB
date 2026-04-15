import { errorUser, receiveUser, requestUser } from "@/lib/redux/slices/master/user"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { getUser } from "@/lib/services"
import { DataUserResponseType } from "@/lib/services/master/user"
import { errorHandler } from "../../errorHandler"
import { put, takeEvery } from "redux-saga/effects"
import { GET_MASTER_USER } from "@/lib/redux/types"

export function* getUserSagas() {
  try {
    yield put(requestUser())

    const response: DataUserResponseType[] = yield getUser({})
    yield put(setTextNotification({ text: '', severity: undefined }))

    yield put(receiveUser(response))
  } catch (error: any) {
    const { message, statusCode } = errorHandler(error)
    yield put(errorUser(message))
    yield put(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
  }
}

export function* watchGetUserAsync() {
  yield takeEvery(GET_MASTER_USER, getUserSagas)
}