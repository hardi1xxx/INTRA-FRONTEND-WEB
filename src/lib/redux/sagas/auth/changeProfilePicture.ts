import { setTextNotification } from '../../slices/notification';
import { CHANGE_PROFILE_PICTURE } from '../../types'
import { put, takeEvery } from 'redux-saga/effects'
import { DefaultServiceResponse, changeProfilePicture } from '@/lib/services';
import { errorChangeProfilePicture, receiveChangeProfilePicture, requestChangeProfilePicture } from '../../slices/auth';
import { errorHandler } from '../errorHandler';
import { setCookie } from 'cookies-next';
import { Base64toFile } from '@/components/helper';

type AnyAction = {type: string, picture: string, fileName: string}

export function* changeProfilePictureSagas({picture,fileName} : AnyAction) {
    try{
        yield put(requestChangeProfilePicture())
        const filePicture = Base64toFile(picture,fileName)
        const loginResponse: DefaultServiceResponse & {result : string} = yield changeProfilePicture(filePicture);
        setCookie('intra_auth_picture',loginResponse.result)
        yield put(receiveChangeProfilePicture(loginResponse.result))

        yield put(setTextNotification({text: 'Change Profile Picture Successfull', severity: 'success'}))
    }catch(error: any){
        const { message, statusCode } = errorHandler(error)
        yield put(errorChangeProfilePicture(message))
        yield put(setTextNotification({text: message, severity: 'error'}))
    }
}

export function* watchChangeProfilePictureAsync() {
    yield takeEvery(CHANGE_PROFILE_PICTURE, changeProfilePictureSagas)
}