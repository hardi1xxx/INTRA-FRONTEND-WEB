import { DataUser, FilterParamsUser, errorUser, receiveUser, requestUser } from "@/lib/redux/slices/master/user"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { errorHandler } from "../../errorHandler"
import { put, takeEvery } from "redux-saga/effects"
import { GET_MASTER_USER } from "@/lib/redux/types"
import { DefaultServiceResponse, getUserFilterData } from "@/lib/services"

type AnyAction = {
  type: string,
  params: FilterParamsUser
}

export function* getUserSagas({ params }: AnyAction) {
  try {
    yield put(requestUser())

    const response: DefaultServiceResponse & {
      result: {
        data: DataUser[];
        recordsTotal: number;
        recordsFiltered: number;
      };
    } = yield getUserFilterData(params)

    yield put(receiveUser({ ...response.result, params }))
  } catch (error: any) {
    const { message, statusCode } = errorHandler(error)
    yield put(errorUser(message))
    yield put(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
  }
}

export function* watchGetUserAsync() {
  yield takeEvery(GET_MASTER_USER, getUserSagas)
}