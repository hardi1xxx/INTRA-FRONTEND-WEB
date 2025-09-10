import { put, takeEvery } from "redux-saga/effects"
import { errorHandler } from "../errorHandler"
import { errorSystemUpdate, receiveSystemUpdate, requestSystemUpdate } from "../../slices/systemUpdate"
import { setTextNotification } from "../../slices/notification"
import { DefaultServiceResponse, getSystemUpdate } from "@/lib/services"
import { SystemUpdateResponseType } from "@/lib/services/system-update"
import { GET_SYSTEM_UPDATE } from "../../types"

export function* getSystemUpdateSagas() {
    try {
        yield put(requestSystemUpdate())

        const response: DefaultServiceResponse & { result: SystemUpdateResponseType[] } = yield getSystemUpdate()

        yield put(receiveSystemUpdate(response.result))
    } catch (error: any) {
        const { message, statusCode } = errorHandler(error)
        yield put(errorSystemUpdate(message))
        yield put(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
    }
}

export function* watchGetSystemUpdateAsync() {
    yield takeEvery(GET_SYSTEM_UPDATE, getSystemUpdateSagas)
}