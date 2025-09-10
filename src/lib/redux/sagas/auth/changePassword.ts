import { setTextNotification } from '../../slices/notification';
import { CHANGE_PASSWORD } from '../../types'
import { put, takeEvery } from 'redux-saga/effects'
import { changePassword } from '@/lib/services';
import { errorChangePassword, receiveChangePassword, requestChangePassword } from '../../slices/auth';
import { errorMenuAccess } from '../../slices/master/menuAccess';
import { errorHandler } from '../errorHandler';

type AnyAction = {type: string, [key: string]: any}

export function* changePasswordSagas({param} : AnyAction) {
    try{   
        yield put(requestChangePassword()) 
        yield changePassword(param);

        yield put(receiveChangePassword()) 

        yield put(setTextNotification({text: 'Change Password Successfull', severity: 'success'}))
    }catch(error: any){
        const { message, statusCode } = errorHandler(error)
        yield put(errorChangePassword(message)) 
        yield put(setTextNotification({text: message, severity: 'error'}))
    }
}

export function* watchChangePasswordAsync() {
    yield takeEvery(CHANGE_PASSWORD, changePasswordSagas)
}