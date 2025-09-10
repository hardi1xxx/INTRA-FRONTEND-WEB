import { errorRole, receiveRole, requestRole } from "@/lib/redux/slices/master/role"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { DefaultServiceResponse, getRole, updateRole } from "@/lib/services"
import { DataRoleRequestType, DataRoleResponseType } from "@/lib/services/master/role"
import { put, takeEvery } from "redux-saga/effects"
import { errorHandler } from "../../errorHandler"
import { UPDATE_ROLE } from "@/lib/redux/types"

type AnyAction = {
  type: string,
  data: DataRoleRequestType
}

export function* updateRoleSagas({ data }: AnyAction) {
  try {
    yield put(requestRole())

    yield updateRole(data)
    const response: DefaultServiceResponse & {result : DataRoleResponseType[]} = yield getRole()
    
    yield put(receiveRole(response.result))

    yield put(setTextNotification({ text: "Update Role Successfull", severity: "success" }))
  } catch (error: any) {
    const { message, statusCode } = errorHandler(error)
    yield put(errorRole(message))
    yield put(setTextNotification({ text: message, severity: "error" }))
  }
}

export function* watchUpdateRoleAsync() {
  yield takeEvery(UPDATE_ROLE, updateRoleSagas)
}