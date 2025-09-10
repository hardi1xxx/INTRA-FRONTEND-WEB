import { errorRole, receiveRole, requestRole } from "@/lib/redux/slices/master/role"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { DELETE_ROLE } from "@/lib/redux/types"
import { DefaultServiceResponse, deleteRole, getRole } from "@/lib/services"
import { DataRoleResponseType } from "@/lib/services/master/role"
import { put, takeEvery } from "redux-saga/effects"
import { errorHandler } from "../../errorHandler"

type AnyAction = {
  type: string,
  id: number
}

export function* deleteRoleSagas({ id }: AnyAction) {
  try {
    yield put(requestRole())

    yield deleteRole(id)
    const response: DefaultServiceResponse & {result : DataRoleResponseType[]} = yield getRole()
    
    yield put(receiveRole(response.result))

    yield put(setTextNotification({ text: "Delete Data Role Successfull", severity: "success" }))
  } catch (error: any) {
    const { message, statusCode } = errorHandler(error)
    yield put(errorRole(message))
    yield put(setTextNotification({ text: message, severity: "error" }))
  }
}

export function* watchDeleteRoleAsync() {
  yield takeEvery(DELETE_ROLE, deleteRoleSagas)
}