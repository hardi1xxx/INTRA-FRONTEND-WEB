import { DataFilterMasterColorway } from "@/lib/services/pcx-library/colorway"
import { errorHandler } from "../../errorHandler"
import { DataMasterColorway, errorMasterColorway, receiveMasterColorway, requestMasterColorway } from "@/lib/redux/slices/pcxLibrary/colorway"
import { put, takeEvery } from "redux-saga/effects"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { DefaultServiceResponse, deleteColorway, getColorway } from "@/lib/services"
import { DELETE_COLORWAY } from "@/lib/redux/types"

type AnyAction = {
    type: string,
    id: number,
    filter: DataFilterMasterColorway
}

export function* deleteColorwaySagas({ id, filter }: AnyAction) {
    try {
        yield put(requestMasterColorway())

        yield deleteColorway(id)

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

        yield put(setTextNotification({text: "Delete Data Successfull", severity: "success"}))
    } catch (error) {
        const { message, statusCode } = errorHandler(error)
        yield put(errorMasterColorway(message))
        yield put(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
    }
}

export function* watchDeleteColorwayAsync() {
    yield takeEvery(DELETE_COLORWAY, deleteColorwaySagas)
}