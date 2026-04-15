import { errorUser, receiveUser, requestUser } from "@/lib/redux/slices/master/user"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { createUser, getUser } from "@/lib/services"
import { DataUserRequestType, DataUserResponseType } from "@/lib/services/master/user"
import { put, takeEvery } from "redux-saga/effects"
import { errorHandler } from "../../errorHandler"
import { CREATE_MASTER_USER } from "@/lib/redux/types"

type AnyAction = {
  type: string,
  data: DataUserRequestType
}

export function* createUserSagas({ data }: AnyAction) {
  try {
    yield put(requestUser())

    yield createUser(data)
    const response: DataUserResponseType[] = yield getUser({})

    yield put(receiveUser(response))

    yield put(setTextNotification({ text: "Create Data Successfully", severity: "success" }))
  } catch (error: any) {
    const { message, statusCode } = errorHandler(error)
    yield put(errorUser(message))
    yield put(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
  }
}

export function* watchCreateUserAsync() {
  yield takeEvery(CREATE_MASTER_USER, createUserSagas)
}