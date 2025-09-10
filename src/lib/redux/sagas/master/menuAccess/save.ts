import { setTextNotification } from '../../../slices/notification';
import { put, takeEvery } from 'redux-saga/effects'
import { SAVE_MENU_ACCESS } from '@/lib/redux/types';
import { DefaultServiceResponse, getMenuAccessByRoleId, getRole, saveMenuAccess } from '@/lib/services';
import { errorHandler } from '../../errorHandler';
import { errorMenuAccess, receiveMenuAccess, requestMenuAccess } from '@/lib/redux/slices/master/menuAccess';
import { DataMenuAccessRequestType, DataMenuAccessResponseType } from '@/lib/services/master/menuAccess';
import { DataRoleResponseType } from '@/lib/services/master/role';
import { receiveRole } from '@/lib/redux/slices/master/role';

type AnyAction = {type: string, data: DataMenuAccessRequestType[],role_id: number}

export function* saveMenuAccessSagas({data,role_id} : AnyAction) {
    try{    
        yield put(requestMenuAccess())

        yield saveMenuAccess(data);
        const response: DefaultServiceResponse & {result : DataMenuAccessResponseType[]} = yield getMenuAccessByRoleId(role_id)
    
        yield put(receiveMenuAccess(response.result))

        const responseRole: DefaultServiceResponse & {result : DataRoleResponseType[]} = yield getRole()        
        yield put(receiveRole(responseRole.result))

        yield put(setTextNotification({text: 'Save Data Menu Access Successfull', severity: 'success'}))
    }catch(error: any){
        const { message } = errorHandler(error)
        yield put(errorMenuAccess(message))
        yield put(setTextNotification({ text: message, severity: "error" }))
    }
}

export function* watchSaveMenuAccessAsync() {
    yield takeEvery(SAVE_MENU_ACCESS, saveMenuAccessSagas)
}