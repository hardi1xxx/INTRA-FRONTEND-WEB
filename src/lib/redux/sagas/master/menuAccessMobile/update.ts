import { errorMenuAccessMobile, receiveMenuAccessMobile, requestMenuAccessMobile } from "@/lib/redux/slices/master/menuAccessMobile"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { DefaultServiceResponse, getMenuAccessMobile, updateMenuAccessMobile } from "@/lib/services"
import { DataMenuAccessMobileRequest, DataMenuAccessMobileResponse } from "@/lib/services/master/menu-access-mobile"
import { put, takeEvery } from "redux-saga/effects"
import { errorHandler } from "../../errorHandler"
import { UPDATE_MENU_ACCESS_MOBILE } from "@/lib/redux/types"

type AnyAction = {
    type: string,
    data: DataMenuAccessMobileRequest
}

export function* updateMenuAccessMobileSagas({ data }: AnyAction) {
    try {
        yield put(requestMenuAccessMobile())

        yield updateMenuAccessMobile(data)
        const response: DefaultServiceResponse & { result: DataMenuAccessMobileResponse[] } = yield getMenuAccessMobile()

        yield put(receiveMenuAccessMobile(response.result))

        yield put(setTextNotification({ text: "Update Data Successfull", severity: "success" }))
    } catch (error: any) {
        const { message } = errorHandler(error)
        yield put(errorMenuAccessMobile(message))
        yield put(setTextNotification({ text: message, severity: "error" }))
    }
}

export function* watchUpdateMenuAccessMobileAsync() {
    yield takeEvery(UPDATE_MENU_ACCESS_MOBILE, updateMenuAccessMobileSagas)
}