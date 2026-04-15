import { ExportLatestFeatureRequestType } from "@/lib/services/master/latestFeature"
import { errorHandler } from "../../errorHandler"
import { errorLatestFeature, receiveExportLatestFeature, requestExportLatestFeature } from "@/lib/redux/slices/master/latestFeature"
import { put, takeEvery } from "redux-saga/effects"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { exportLatestFeature } from "@/lib/services"
import { EXPORT_SETTING_LATEST_FEATURE } from "@/lib/redux/types"

type AnyAction = {
    type: string,
    data: ExportLatestFeatureRequestType
}

export function* exportLatestFeatureSagas({ data }: AnyAction) {
    try {
        yield put(requestExportLatestFeature())

        const response: Blob = yield exportLatestFeature(data)

        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Setting-Latest-Feature.xlsx`);
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