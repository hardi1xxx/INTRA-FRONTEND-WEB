import { GetLatestFeatureRequestType } from "@/lib/services/master/latestFeature"
import { errorHandler } from "../../errorHandler"
import { errorLatestFeature, receiveExportLatestFeature, requestExportLatestFeature } from "@/lib/redux/slices/master/latestFeature"
import { put, select, takeEvery } from "redux-saga/effects"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { exportLatestFeature } from "@/lib/services"
import { EXPORT_SETTING_LATEST_FEATURE } from "@/lib/redux/types"
import { RootState } from "@/lib/redux/store"
import { getDateNow } from "@/components/helper"

type AnyAction = {
    type: string
}

export function* exportLatestFeatureSagas() {
    try {
        yield put(requestExportLatestFeature())

        const params: GetLatestFeatureRequestType = yield select((state: RootState) => state.latestFeature.params)
        const response: Blob = yield exportLatestFeature(params)

        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Setting-Latest-Feature-export-${getDateNow()}.xlsx`);
        document.body.appendChild(link);
        link.click();

        yield put(receiveExportLatestFeature())
    } catch (error: any) {
        const { message, statusCode } = errorHandler(error)
        yield put(errorLatestFeature(message))
        yield put(setTextNotification({ text: message, severity: 'error', responseCode: statusCode }))
    }
}

export function* watchExportLatestFeatureAsync() {
    yield takeEvery(EXPORT_SETTING_LATEST_FEATURE, exportLatestFeatureSagas)
}