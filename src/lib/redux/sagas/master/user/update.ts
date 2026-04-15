import { errorUser, receiveUser, requestUser } from "@/lib/redux/slices/master/user"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { getUser, updateUser } from "@/lib/services"
import { DataUserRequestType, DataUserResponseType } from "@/lib/services/master/user"
import { put, takeEvery } from "redux-saga/effects"
import { errorHandler } from "../../errorHandler"
import { UPDATE_MASTER_USER } from "@/lib/redux/types"

type AnyAction = {
  type: string,
  id: number,
  data: DataUserRequestType
}

export function* updateUserSagas({ id, data }: AnyAction) {
  try {
    yield put(requestUser())

    yield updateUser(id, data)
    const response: DataUserResponseType[] = yield getUser({})

    yield put(receiveUser(response))

    yield put(setTextNotification({ text: "Update Data Successfully", severity: "success" }))
  } catch (error: any) {
    const { message, statusCode } = errorHandler(error)
    yield put(errorUser(message))
    yield put(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
  }
}

export function* watchUpdateUserAsync() {
  yield takeEvery(UPDATE_MASTER_USER, updateUserSagas)
}