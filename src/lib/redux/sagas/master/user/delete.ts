import { errorUser, receiveUser, requestUser } from "@/lib/redux/slices/master/user"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { deleteUser, getUser } from "@/lib/services"
import { DataUserResponseType } from "@/lib/services/master/user"
import { put, takeEvery } from "redux-saga/effects"
import { errorHandler } from "../../errorHandler"
import { DELETE_MASTER_USER } from "@/lib/redux/types"

type AnyAction = {
  type: string,
  id: number
}

export function* deleteUserSagas({ id }: AnyAction) {
  try {
    yield put(requestUser())

    yield deleteUser(id)
    const response: DataUserResponseType[] = yield getUser({})

    yield put(receiveUser(response))

    yield put(setTextNotification({ text: "Delete Data Successfully", severity: "success" }))
  } catch (error: any) {
    const { message, statusCode } = errorHandler(error)
    yield put(errorUser(message))
    yield put(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
  }
}

export function* watchDeleteUserAsync() {
  yield takeEvery(DELETE_MASTER_USER, deleteUserSagas)
}