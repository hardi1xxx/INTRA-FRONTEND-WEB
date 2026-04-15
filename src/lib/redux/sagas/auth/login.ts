import { setCookie } from 'cookies-next';
import { login } from '../../../services';
import { LoginServiceResponse } from '../../../services/auth';
import { setTextNotification } from '../../slices/notification';
import { errorAuth, receiveAuth, requestAuth } from '../../slices/auth';
import { LOGIN } from '../../types'
import { put, takeEvery } from 'redux-saga/effects'

type AnyAction = { type: string, [key: string]: any }

export function* loginSagas({ param }: AnyAction) {
    try {
        yield put(requestAuth())
        const loginResponse: LoginServiceResponse = yield login(param);

        setCookie('intra_auth_token', loginResponse.data.access_token)
        setCookie('intra_auth_name', loginResponse.data.user.name)
        setCookie('intra_auth_nik', loginResponse.data.user.nik)
        // setCookie('intra_auth_picture', loginResponse.data.picture)
        setCookie('intra_auth_role', loginResponse.data.role)
        setCookie('intra_auth_expires_in', loginResponse.data.expires_in)
        setCookie('intra_auth_menu_access', loginResponse.data.menu_access)


        yield put(receiveAuth({ name: loginResponse.data.user.name, role: loginResponse.data.role }))

        yield put(setTextNotification({ text: 'Login Successfull', severity: 'success' }))
    } catch (error: any) {
        yield put(errorAuth(error.message))
        yield put(setTextNotification({ text: error.message, severity: 'error' }))
    }
}

export function* watchLoginAsync() {
    yield takeEvery(LOGIN, loginSagas)
}