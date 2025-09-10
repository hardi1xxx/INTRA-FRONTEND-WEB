import { errorRole, receiveRole, requestRole } from "@/lib/redux/slices/master/role"
import { GET_ROLE } from "@/lib/redux/types"
import { DefaultServiceResponse, getRole } from "@/lib/services"
import { DataRoleResponseType } from "@/lib/services/master/role"
import { call, put, takeEvery } from "redux-saga/effects"
import { errorHandler } from "../../errorHandler"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { logoutSagas } from "../../auth/logout"

export function* getRoleSagas() {
  try {
    yield put(requestRole())

    const response: DefaultServiceResponse & {result : DataRoleResponseType[]} = yield getRole()
    
    yield put(receiveRole(response.result))
  } catch (error: any) {
    const { message, statusCode } = errorHandler(error)
    yield put(errorRole(message))
    yield put(setTextNotification({ text: message, severity: "error" }))
  }
}

export function* watchGetRoleAsync() {
  yield takeEvery(GET_ROLE, getRoleSagas)
}
