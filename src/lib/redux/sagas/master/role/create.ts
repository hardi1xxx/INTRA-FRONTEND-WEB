import { setTextNotification } from '../../../slices/notification';
import { put, takeEvery } from 'redux-saga/effects'
import { CREATE_ROLE } from '@/lib/redux/types';
import { DataRoleRequestType, DataRoleResponseType } from '@/lib/services/master/role';
import { DefaultServiceResponse, createRole, getRole } from '@/lib/services';
import { errorRole, receiveRole, requestRole } from '@/lib/redux/slices/master/role';
import { errorHandler } from '../../errorHandler';

type AnyAction = {type: string, data: DataRoleRequestType}

export function* createRoleSagas({data} : AnyAction) {
    try{    
        yield put(requestRole())

        yield createRole(data);
        const response: DefaultServiceResponse & {result : DataRoleResponseType[]} = yield getRole()
    
        yield put(receiveRole(response.result))

        yield put(setTextNotification({text: 'Create Data Role Successfull', severity: 'success'}))
    }catch(error: any){
        const { message, statusCode } = errorHandler(error)
        yield put(errorRole(message))
        yield put(setTextNotification({ text: message, severity: "error" }))
    }
}

export function* watchCreateRoleAsync() {
    yield takeEvery(CREATE_ROLE, createRoleSagas)
}