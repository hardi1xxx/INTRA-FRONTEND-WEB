import { DataMasterColorway, errorMasterColorway, receiveMasterColorway, requestMasterColorway } from "@/lib/redux/slices/pcxLibrary/colorway"
import { DataFilterMasterColorway } from "@/lib/services/pcx-library/colorway"
import { errorHandler } from "../../errorHandler"
import { put, takeEvery } from "redux-saga/effects"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { DefaultServiceResponse, getColorway, updateColorway } from "@/lib/services"
import { UPDATE_COLORWAY } from "@/lib/redux/types"

type AnyAction = {
    type: string,
    data: DataMasterColorway,
    filter: DataFilterMasterColorway,
    id: number
}

export function* updateColorwaySagas({ data, filter, id }: AnyAction) {
    try {
        yield put(requestMasterColorway())

        yield updateColorway(id, data)

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

        yield put(setTextNotification({text: "Update Data Successfull", severity: "success"}))
    } catch (error) {
        const { message, statusCode } = errorHandler(error)
        yield put(errorMasterColorway(message))
        yield put(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
    }
}

export function* watchUpdateColorwayAsync() {
    yield takeEvery(UPDATE_COLORWAY, updateColorwaySagas)
}