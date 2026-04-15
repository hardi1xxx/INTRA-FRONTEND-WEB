import { DataMasterColorway, errorMasterColorway, receiveMasterColorway, requestMasterColorway } from "@/lib/redux/slices/pcxLibrary/colorway"
import { errorHandler } from "../../errorHandler"
import { put, takeEvery } from "redux-saga/effects"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { DefaultServiceResponse, getColorway, inserFileColorway } from "@/lib/services"
import { DataFilterMasterColorway } from "@/lib/services/pcx-library/colorway"
import { INSERT_FILE_UPLOAD_COLORWAY } from "@/lib/redux/types"

type AnyAction = {
    type: string,
    data: DataMasterColorway[],
    filter: DataFilterMasterColorway
}

export function* insertUploadColorwaySagas({ data, filter }: AnyAction) {
    try {
        yield put(requestMasterColorway())

        yield inserFileColorway(data)

        const response: DefaultServiceResponse & {
            result: {
                data: DataMasterColorway[];
                recordsTotal: number;
                recordsFilter: number;
            };
        } = yield getColorway(filter)

        const resultData = response.result.data.map((res: DataMasterColorway, index: number) => {
            return {
                ...res,
                id: index + 1,
                no: (filter.start + (index + 1))
            }
        })

        yield put(receiveMasterColorway({
            ...response.result,
            data: resultData,
            params: filter
        }))

        yield put(setTextNotification({text: "Upload Data Successfull", severity: "success"}))
    } catch (error) {
        const { message, statusCode } = errorHandler(error)
        yield put(errorMasterColorway(message))
        yield put(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
    }
}

export function* watchInsertUploadColorwayAsync() {
    yield takeEvery(INSERT_FILE_UPLOAD_COLORWAY, insertUploadColorwaySagas)
}