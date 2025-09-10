import { setTextNotification } from '../../../slices/notification';
import { put, takeEvery } from 'redux-saga/effects'
import { GET_MENU_ACCESS } from '@/lib/redux/types';
import { DefaultServiceResponse, getMenuAccessByRoleId } from '@/lib/services';
import { errorHandler } from '../../errorHandler';
import { DataMenuAccessResponseType } from '@/lib/services/master/menuAccess';
import { errorMenuAccess, receiveMenuAccess, requestMenuAccess } from '@/lib/redux/slices/master/menuAccess';

type AnyAction = {type: string, role_id: number}

export function* getMenuAccessByRoleSagas({role_id} : AnyAction) {
    try{    
        yield put(requestMenuAccess())

        const response: DefaultServiceResponse & {result : DataMenuAccessResponseType[]} = yield getMenuAccessByRoleId(role_id)
        
        yield put(receiveMenuAccess(response.result))

    }catch(error: any){
        const { message, statusCode } = errorHandler(error)
        yield put(errorMenuAccess(message))
        yield put(setTextNotification({ text: message, severity: "error" }))
    }
}

export function* watchGetMenuAccessByRoleAsync() {
    yield takeEvery(GET_MENU_ACCESS, getMenuAccessByRoleSagas)
}