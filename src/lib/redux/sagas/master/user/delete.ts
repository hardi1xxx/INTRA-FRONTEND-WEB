import { DataUser, FilterParamsUser, errorUser, receiveUser, requestUser } from "@/lib/redux/slices/master/user"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { DefaultServiceResponse, deleteUser, getUserFilterData } from "@/lib/services"
import { put, select, takeEvery } from "redux-saga/effects"
import { errorHandler } from "../../errorHandler"
import { DELETE_MASTER_USER } from "@/lib/redux/types"
import { RootState } from "@/lib/redux/store"

type AnyAction = {
  type: string,
  id: number
}

export function* deleteUserSagas({ id }: AnyAction) {
  try {
    yield put(requestUser())

    yield deleteUser(id)
    const params: FilterParamsUser = yield select((state: RootState) => state.user.params)
    const response: DefaultServiceResponse & {
      result: {
        data: DataUser[];
        recordsTotal: number;
        recordsFiltered: number;
      };
    } = yield getUserFilterData(params)

    yield put(receiveUser({ ...response.result, params }))
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