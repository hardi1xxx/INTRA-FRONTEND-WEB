import { DataAccessMobileRequest, DataAccessMobileResponse } from "@/lib/services/master/menu-access-mobile";
import { errorHandler } from "../../errorHandler";
import { put, takeEvery } from "redux-saga/effects";
import { errorMenuAccessMobile, receiveMenuAccessMobileByRole, requestMenuAccessMobile } from "@/lib/redux/slices/master/menuAccessMobile";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { DefaultServiceResponse, getMenuAccessMobileByRoleId, getRole, saveMenuAccessMobileByRoleId } from "@/lib/services";
import { SAVE_MENU_ACCESS_MOBILE_BY_ROLE_ID } from "@/lib/redux/types";
import { DataRoleResponseType } from "@/lib/services/master/role";
import { receiveRole } from "@/lib/redux/slices/master/role";

type AnyAction = { type: string, data: DataAccessMobileRequest[], role_id: number }

export function* saveMenuAccessMobileByRoleSagas({ data, role_id }: AnyAction) {
    try {
        yield put(requestMenuAccessMobile())

        yield saveMenuAccessMobileByRoleId(data)

        const response: DefaultServiceResponse & { result: DataAccessMobileResponse[] } = yield getMenuAccessMobileByRoleId(role_id)

        yield put(receiveMenuAccessMobileByRole(response.result))

        const responseRole: DefaultServiceResponse & {result : DataRoleResponseType[]} = yield getRole()        
        yield put(receiveRole(responseRole.result))

        yield put(setTextNotification({ text: 'Save Data Menu Access Mobile Successfull', severity: 'success' }))
    } catch (error: any) {
        const { message } = errorHandler(error)
        yield put(errorMenuAccessMobile(message))
        yield put(setTextNotification({ text: message, severity: "error" }))
    }
}

export function* watchSaveMenuAccessMobileByRoleAsync() {
    yield takeEvery(SAVE_MENU_ACCESS_MOBILE_BY_ROLE_ID, saveMenuAccessMobileByRoleSagas)
}