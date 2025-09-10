import { DataUser, FilterParamsUser, errorUser, receiveUser, requestUser, setFormErrorsUser } from "@/lib/redux/slices/master/user"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { DefaultServiceResponse, getUserFilterData, updateUser } from "@/lib/services"
import { DataUserRequestType } from "@/lib/services/master/user"
import { put, select, takeEvery } from "redux-saga/effects"
import { errorHandler } from "../../errorHandler"
import { UPDATE_MASTER_USER } from "@/lib/redux/types"
import { RootState } from "@/lib/redux/store"

type AnyAction = {
  type: string,
  id: number,
  data: DataUserRequestType
}

export function* updateUserSagas({ id, data }: AnyAction) {
  try {
    yield put(setFormErrorsUser([]))
    yield put(requestUser())

    yield updateUser(id, data)
    const params: FilterParamsUser = yield select((state: RootState) => state.user.params)
    const response: DefaultServiceResponse & {
      result: {
        data: DataUser[];
        recordsTotal: number;
        recordsFiltered: number;
      };
    } = yield getUserFilterData(params)

    yield put(receiveUser({ ...response.result, params }))
    yield put(setTextNotification({ text: "Update Data Successfully", severity: "success" }))
  } catch (error: any) {
    const { message, statusCode, errorValidations } = errorHandler(error)
    if (errorValidations.length > 0) {
      yield put(setFormErrorsUser(errorValidations))
    } else {
      yield put(errorUser(message))
      yield put(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
    }
  }
}

export function* watchUpdateUserAsync() {
  yield takeEvery(UPDATE_MASTER_USER, updateUserSagas)
}