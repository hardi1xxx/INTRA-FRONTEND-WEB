import { errorMasterColorway, receiveUploadMasterColorway, requestUploadMasterColorway } from "@/lib/redux/slices/pcxLibrary/colorway"
import { errorHandler } from "../../errorHandler"
import { put, takeEvery } from "redux-saga/effects"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { Base64toFile } from "@/components/helper"
import { DefaultServiceResponse, uploadColorway } from "@/lib/services"
import { DataUploadMasterColorwayResponseType } from "@/lib/services/pcx-library/colorway"
import { UPLOAD_COLORWAY } from "@/lib/redux/types"

type AnyAction = {
    type: string,
    file: string,
    fileName: string
}

export function* uploadColorwaySagas({ file, fileName }: AnyAction) {
    try {
        yield put(requestUploadMasterColorway())

        const fileExcel = Base64toFile(file, fileName)

        const response: DefaultServiceResponse & { result: DataUploadMasterColorwayResponseType } = yield uploadColorway(fileExcel)

        const result = {
            valid: response.result.valid.map((value, index) => ({ ...value, org_id: '82' })),
            invalid: response.result.invalid.map((value, index) => ({ ...value, org_id: '82' })),
        }

        yield put(receiveUploadMasterColorway(result))
    } catch (error: any) {
        const { message, statusCode } = errorHandler(error)
        yield put(errorMasterColorway(message))
        yield put(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
    }
}

export function* watchUploadColorwayAsync() {
    yield takeEvery(UPLOAD_COLORWAY, uploadColorwaySagas)
}