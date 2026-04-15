import { GetLatestFeatureRequestType, LatestFeatureRequestType, LatestFeatureResponseType } from "@/lib/services/master/latestFeature"
import { errorHandler } from "../../errorHandler"
import { errorLatestFeature, receiveLatestFeature, requestLatestFeature } from "@/lib/redux/slices/master/latestFeature"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { put, takeEvery } from "redux-saga/effects"
import { DefaultServiceResponse, createLatestFeature, getLatestFeature } from "@/lib/services"
import { CREATE_SETTING_LATEST_FEATURE } from "@/lib/redux/types"

type AnyAction = {
    type: string,
    data: LatestFeatureRequestType,
    params: GetLatestFeatureRequestType,
}

export function* createLatestFeatureSagas({ data, params }: AnyAction) {
    try {
        yield put(requestLatestFeature())
        
        yield createLatestFeature(data)
        const response: DefaultServiceResponse & { result: { data: LatestFeatureResponseType[], recordsTotal: number, recordsFiltered: number } } = yield getLatestFeature(params)

        yield put(receiveLatestFeature({
           ...response.result,
           params: params
        }))
        yield put(setTextNotification({ text: "Create Data Successfully", severity: "success" }))
    } catch (error: any) {
        const { message, statusCode } = errorHandler(error)
        yield put(errorLatestFeature(message))
        yield put(setTextNotification({ text: message, severity: 'error', responseCode: statusCode }))
    }
}

export function* watchCreateLatestFeatureAsync() {
    yield takeEvery(CREATE_SETTING_LATEST_FEATURE, createLatestFeatureSagas)
}