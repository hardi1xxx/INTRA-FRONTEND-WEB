import { DataUser, errorUser, receiveUserDetail, requestUserDetail } from "@/lib/redux/slices/master/user"
import { put, takeEvery } from "redux-saga/effects"
import { errorHandler } from "../../errorHandler"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { DefaultServiceResponse, getUserByID } from "@/lib/services"
import { GET_USER_BY_ID } from "@/lib/redux/types"

type AnyAction = {
    type: string,
    id: number
}

export function* getDetailUserSagas({ id }: AnyAction) {
    try {
        yield put(requestUserDetail())

        const response: DefaultServiceResponse & {
            result: DataUser
        } = yield getUserByID(id)

        yield put(receiveUserDetail(response.result))

    } catch (error: any) {
        const { message, statusCode } = errorHandler(error)
        yield put(errorUser(message))
        yield put(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
    }
}

export function* watchGetDetailUserAsync() {
    yield takeEvery(GET_USER_BY_ID, getDetailUserSagas)
}