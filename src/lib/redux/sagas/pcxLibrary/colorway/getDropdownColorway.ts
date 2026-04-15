import { DataDropdownMasterColorway } from "@/lib/services/pcx-library/colorway"
import { errorHandler } from "../../errorHandler"
import { delay, put, takeLatest } from "redux-saga/effects"
import { errorMasterColorway, receiveColorwayIDMasterColorway, receiveColorwayStateMasterColorway, receiveColorwayStatusMasterColorway, receiveColorwayTypeMasterColorway, receiveNikeColorwayCodeMasterColorway, receiveNikeColorwayIDMasterColorway, receiveNikeColorwayNameMasterColorway, requestColorwayIDMasterColorway, requestColorwayStateMasterColorway, requestColorwayStatusMasterColorway, requestColorwayTypeMasterColorway, requestNikeColorwayCodeMasterColorway, requestNikeColorwayIDMasterColorway, requestNikeColorwayNameMasterColorway } from "@/lib/redux/slices/pcxLibrary/colorway"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { DefaultServiceResponse, getDataDropdownColorway } from "@/lib/services"
import { GET_DROPDOWN_DATA_COLORWAY } from "@/lib/redux/types"

type AnyAction = {
    type: string,
    data: DataDropdownMasterColorway
}

export function* getDropdownColorwaySagas({ data }: AnyAction) {
    try {
        switch (data.column) {
            case 'colorway_id':
                yield put(requestColorwayIDMasterColorway())
                break;
            case "nike_colorway_id":
                yield put(requestNikeColorwayIDMasterColorway())
                break;
            case "nike_colorway_code":
                yield put(requestNikeColorwayCodeMasterColorway())
                break;
            case "nike_colorway_name":
                yield put(requestNikeColorwayNameMasterColorway())
                break;
            case "colorway_state":
                yield put(requestColorwayStateMasterColorway())
                break;
            case "colorway_status":
                yield put(requestColorwayStatusMasterColorway())
                break;
            case "colorway_type":
                yield put(requestColorwayTypeMasterColorway())
                break;
            default:
                break;
        }

        yield delay(500)

        const response: DefaultServiceResponse & { result: any } = yield getDataDropdownColorway(data)

        switch (data.column) {
            case 'colorway_id':
                yield put(receiveColorwayIDMasterColorway(response.result))
                break;
            case "nike_colorway_id":
                yield put(receiveNikeColorwayIDMasterColorway(response.result))
                break;
            case "nike_colorway_code":
                yield put(receiveNikeColorwayCodeMasterColorway(response.result))
                break;
            case "nike_colorway_name":
                yield put(receiveNikeColorwayNameMasterColorway(response.result))
                break;
            case "colorway_state":
                yield put(receiveColorwayStateMasterColorway(response.result))
                break;
            case "colorway_status":
                yield put(receiveColorwayStatusMasterColorway(response.result))
                break;
            case "colorway_type":
                yield put(receiveColorwayTypeMasterColorway(response.result))
                break;
            default:
                break;
        }

    } catch (error) {
        const { message, statusCode } = errorHandler(error)
        yield put(errorMasterColorway(message))
        yield put(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
    }
}

export function* watchGetDropdownColorwayAsync() {
    yield takeLatest(GET_DROPDOWN_DATA_COLORWAY, getDropdownColorwaySagas)
}