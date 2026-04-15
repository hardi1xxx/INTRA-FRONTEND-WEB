import { errorMenuAccessMobile, receiveMenuAccessMobile, requestMenuAccessMobile } from "@/lib/redux/slices/master/menuAccessMobile"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { DefaultServiceResponse, deleteMenuAccessMobile, getMenuAccessMobile } from "@/lib/services"
import { DataMenuAccessMobileResponse } from "@/lib/services/master/menu-access-mobile"
import { put, takeEvery } from "redux-saga/effects"
import { errorHandler } from "../../errorHandler"
import { DELETE_MENU_ACCESS_MOBILE } from "@/lib/redux/types"

type AnyAction = {
    type: string,
    id: number
}

export function* deleteMenuAccessMobileSagas({ id }: AnyAction) {
    try {
        yield put(requestMenuAccessMobile())

        yield deleteMenuAccessMobile(id)
        const response: DefaultServiceResponse & { result: DataMenuAccessMobileResponse[] } = yield getMenuAccessMobile()

        yield put(receiveMenuAccessMobile(response.result))

        yield put(setTextNotification({ text: "Delete Data Successfull", severity: "success" }))
    } catch (error: any) {
        const { message} = errorHandler(error)
        yield put(errorMenuAccessMobile(message))
        yield put(setTextNotification({ text: message, severity: "error" }))
    }
}

export function* watchDeleteMenuAccessMobileAsync() {
    yield takeEvery(DELETE_MENU_ACCESS_MOBILE, deleteMenuAccessMobileSagas)
}