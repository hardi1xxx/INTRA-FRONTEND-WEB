import { GetLatestFeatureRequestType, LatestFeatureRequestType, LatestFeatureResponseType } from "@/lib/services/master/latestFeature"
import { errorHandler } from "../../errorHandler"
import { errorLatestFeature, receiveLatestFeature, requestLatestFeature } from "@/lib/redux/slices/master/latestFeature"
import { put, select, takeEvery } from "redux-saga/effects"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { DefaultServiceResponse, getLatestFeature, updateLatestFeature } from "@/lib/services"
import { UPDATE_SETTING_LATEST_FEATURE } from "@/lib/redux/types"
import { RootState } from "@/lib/redux/store"

type AnyAction = {
    type: string,
    id: number,
    data: LatestFeatureRequestType
}

export function* updateLatestFeatureSagas({ id, data }: AnyAction) {
    try {
        yield put(requestLatestFeature())

        yield updateLatestFeature(id, data)

        const params: GetLatestFeatureRequestType = yield select((state: RootState) => state.latestFeature.params)
        const response: DefaultServiceResponse & { result: { data: LatestFeatureResponseType[], recordsTotal: number, recordsFiltered: number } } = yield getLatestFeature(params)

        yield put(receiveLatestFeature({
            ...response.result,
            params: params
        }))

        yield put(setTextNotification({ text: "Update Data Successfully", severity: "success" }))
    } catch (error: any) {
        const { message, statusCode } = errorHandler(error)
        yield put(errorLatestFeature(message))
        yield put(setTextNotification({ text: message, severity: 'error', responseCode: statusCode }))
    }
}

export function* watchUpdateLatestFeatureAsync() {
    yield takeEvery(UPDATE_SETTING_LATEST_FEATURE, updateLatestFeatureSagas)
}