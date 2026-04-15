import { errorMasterColorway, receiveDownloadTemplateMasterColorway, requestDownloadTemplateMasterColorway } from "@/lib/redux/slices/pcxLibrary/colorway"
import { errorHandler } from "../../errorHandler"
import { put, takeEvery } from "redux-saga/effects"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { DOWNLOAD_TEMPLATE_COLORWAY } from "@/lib/redux/types"

export function* downloadTemplateColorwaySagas() {
    try {
        yield put(requestDownloadTemplateMasterColorway())
        const link = document.createElement('a')
        link.href = `${(process.env.NEXT_PUBLIC_TARGET_API)?.replace('/api','')}/Template/MColorway-Template.xlsx`;
        link.setAttribute('download', 'Template-Master-Colorway.xlsx')
        document.body.appendChild(link)
        link.click()

        yield put(receiveDownloadTemplateMasterColorway())
    } catch (error) {
        const { message, statusCode } = errorHandler(error)
        yield put(errorMasterColorway(message))
        yield put(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
    }
}

export function* watchDownloadTemplateColorwayAsync() {
    yield takeEvery(DOWNLOAD_TEMPLATE_COLORWAY, downloadTemplateColorwaySagas)
}