import { errorMenuAccessMobile, receiveMenuAccessMobileByRole, requestMenuAccessMobile } from "@/lib/redux/slices/master/menuAccessMobile"
import { DefaultServiceResponse, getMenuAccessMobileByRoleId } from "@/lib/services"
import { DataAccessMobileResponse } from "@/lib/services/master/menu-access-mobile"
import { put, takeEvery } from "redux-saga/effects"
import { errorHandler } from "../../errorHandler"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { GET_MENU_ACCESS_MOBILE_BY_ROLE_ID } from "@/lib/redux/types"

type AnyAction = { type: string, role_id: number }

export function* getMenuAccessMobileByRoleSagas({ role_id }: AnyAction) {
    try {
        yield put(requestMenuAccessMobile())

        const response: DefaultServiceResponse & { result: DataAccessMobileResponse[] } = yield getMenuAccessMobileByRoleId(role_id)

        yield put(receiveMenuAccessMobileByRole(response.result))

    } catch (error: any) {
        const { message } = errorHandler(error)
        yield put(errorMenuAccessMobile(message))
        yield put(setTextNotification({ text: message, severity: "error" }))
    }
}

export function* watchGetMenuAccessMobileByRoleAsync() {
    yield takeEvery(GET_MENU_ACCESS_MOBILE_BY_ROLE_ID, getMenuAccessMobileByRoleSagas)
}