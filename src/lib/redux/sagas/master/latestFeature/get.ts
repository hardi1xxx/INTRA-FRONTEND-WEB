import { GetLatestFeatureRequestType, LatestFeatureResponseType } from "@/lib/services/master/latestFeature"
import { errorHandler } from "../../errorHandler"
import { errorLatestFeature, receiveLatestFeature, requestLatestFeature } from "@/lib/redux/slices/master/latestFeature"
import { put, takeEvery } from "redux-saga/effects"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { DefaultServiceResponse, getLatestFeature } from "@/lib/services"
import { GET_SETTING_LATEST_FEATURE } from "@/lib/redux/types"

type AnyAction = {
    type: string,
    data: GetLatestFeatureRequestType
}

export function* getLatestFeatureSagas({ data }: AnyAction) {
    try {
        yield put(requestLatestFeature())

        const response: DefaultServiceResponse & { result: { data: LatestFeatureResponseType[], recordsTotal: number, recordsFiltered: number } } = yield getLatestFeature(data)

        yield put(receiveLatestFeature({
           ...response.result,
           params: data
        }))
    } catch (error: any) {
        const { message, statusCode } = errorHandler(error)
        yield put(errorLatestFeature(message))
        yield put(setTextNotification({ text: message, severity: 'error', responseCode: statusCode }))
    }
}

export function* watchGetLatestFeatureAsync() {
    yield takeEvery(GET_SETTING_LATEST_FEATURE, getLatestFeatureSagas)
}