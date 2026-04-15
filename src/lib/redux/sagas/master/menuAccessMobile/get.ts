import { errorMenuAccessMobile, receiveMenuAccessMobile, requestMenuAccessMobile } from "@/lib/redux/slices/master/menuAccessMobile"
import { DefaultServiceResponse, getMenuAccessMobile } from "@/lib/services"
import { DataMenuAccessMobileResponse } from "@/lib/services/master/menu-access-mobile"
import { put, takeEvery } from "redux-saga/effects"
import { errorHandler } from "../../errorHandler"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { GET_MENU_ACCESS_MOBILE } from "@/lib/redux/types"

export function* getMenuAccessMobileSagas() {
    try {
        yield put(requestMenuAccessMobile())

        const response: DefaultServiceResponse & { result: DataMenuAccessMobileResponse[] } = yield getMenuAccessMobile()

        yield put(receiveMenuAccessMobile(response.result))
    } catch (error: any) {
        const { message } = errorHandler(error)
        yield put(errorMenuAccessMobile(message))
        yield put(setTextNotification({ text: message, severity: "error" }))
    }
}

export function* watchGetMenuAccessMobileAsync() {
    yield takeEvery(GET_MENU_ACCESS_MOBILE, getMenuAccessMobileSagas)
}
