import { DataFilterExportMasterColorway } from "@/lib/services/pcx-library/colorway"
import { errorHandler } from "../../errorHandler"
import { errorMasterColorway, receiveExportMasterColorway, requestExportMasterColorway } from "@/lib/redux/slices/pcxLibrary/colorway"
import { put, takeEvery } from "redux-saga/effects"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { exportExcelColorway } from "@/lib/services"
import { EXPORT_COLORWAY } from "@/lib/redux/types"

type AnyAction = {
    type: string,
    data: DataFilterExportMasterColorway
}

export function* exportColorwaySagas({ data }: AnyAction) {
    try {
        yield put(requestExportMasterColorway())

        const response: Blob = yield exportExcelColorway(data)

        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Master-Colorway.xlsx`);
        document.body.appendChild(link);
        link.click();

        yield put(receiveExportMasterColorway())
        yield put(setTextNotification({text: "Export Data Successfull", severity: "success"}))
    } catch (error) {
        const { message, statusCode } = errorHandler(error)
        yield put(errorMasterColorway(message))
        yield put(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
    }
}

export function* watchExportColorwayAsync() {
    yield takeEvery(EXPORT_COLORWAY, exportColorwaySagas)
}