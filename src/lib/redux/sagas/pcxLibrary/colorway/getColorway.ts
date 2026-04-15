import { DataFilterMasterColorway } from "@/lib/services/pcx-library/colorway"
import { errorHandler } from "../../errorHandler"
import { DataMasterColorway, errorMasterColorway, receiveMasterColorway, requestMasterColorway } from "@/lib/redux/slices/pcxLibrary/colorway"
import { delay, put, takeLatest } from "redux-saga/effects"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { DefaultServiceResponse, getColorway } from "@/lib/services"
import { GET_DATA_COLORWAY } from "@/lib/redux/types"

type AnyAction = {
    type: string,
    data: DataFilterMasterColorway
}

export function* getColorwaySagas({ data }: AnyAction) {
    try {
        yield put(requestMasterColorway())

        yield delay(250)

        const response: DefaultServiceResponse & {
            result: {
                data: DataMasterColorway[];
                recordsTotal: number;
                recordsFilter: number;
            };
        } = yield getColorway(data)

        const resultData = response.result.data.map((res: DataMasterColorway, index: number) => {
            return {
                ...res,
                id: index + 1,
                no: (data.start + (index + 1))
            }
        })

        yield put(receiveMasterColorway({
            ...response.result,
            data: resultData,
            params: data
        }))
    } catch (error) {
        const { message, statusCode } = errorHandler(error)
        yield put(errorMasterColorway(message))
        yield put(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
    }
}

export function* watchGetColorwayAsync() {
    yield takeLatest(GET_DATA_COLORWAY, getColorwaySagas)
}