import { errorLatestFeature, receiveLatestFeature, requestLatestFeature } from "@/lib/redux/slices/master/latestFeature"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { DefaultServiceResponse, getLatestFeature, deleteLatestFeature } from "@/lib/services"
import { GetLatestFeatureRequestType, LatestFeatureResponseType } from "@/lib/services/master/latestFeature"
import { put, select, takeEvery } from "redux-saga/effects"
import { errorHandler } from "../../errorHandler"
import { DELETE_SETTING_LATEST_FEATURE } from "@/lib/redux/types"
import { RootState } from "@/lib/redux/store"

type AnyAction = {
    type: string
    id: number
}

export function* deleteLatestFeatureSagas({ id }: AnyAction) {
    try {
        yield put(requestLatestFeature())

        yield deleteLatestFeature(id)
        const params: GetLatestFeatureRequestType = yield select((state: RootState) => state.latestFeature.params)
        const response: DefaultServiceResponse & { result: { data: LatestFeatureResponseType[], recordsTotal: number, recordsFiltered: number } } = yield getLatestFeature(params)

        yield put(receiveLatestFeature({
            ...response.result,
            params: params
        }))

        yield put(setTextNotification({ text: "Delete Data Successfully", severity: "success" }))
    } catch (error: any) {
        const { message, statusCode } = errorHandler(error)
        yield put(errorLatestFeature(message))
        yield put(setTextNotification({ text: message, severity: 'error', responseCode: statusCode }))
    }
}

export function* watchDeleteLatestFeatureAsync() {
    yield takeEvery(DELETE_SETTING_LATEST_FEATURE, deleteLatestFeatureSagas)
}