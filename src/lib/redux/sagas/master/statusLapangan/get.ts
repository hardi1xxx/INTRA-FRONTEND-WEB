import { statusLapanganActions } from "@/lib/redux/slices/master/statusLapangan";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { GET_STATUS_LAPANGAN, GET_STATUS_LAPANGAN_DROPDOWN } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { getDropdownStatusLapangan, getStatusLapanganDatatable } from "@/lib/services";
import { RootState } from "@/lib/redux/store";
import { PayloadAction } from "@reduxjs/toolkit";

function* getDatatable() {
  try {
    yield put(statusLapanganActions.request());

    const params: RootState["statusLapangan"]["params"] = yield select(
      (state: RootState) => state.statusLapangan.params
    );

    const response: Awaited<ReturnType<typeof getStatusLapanganDatatable>> =
      yield getStatusLapanganDatatable(params);

    yield put(statusLapanganActions.receive(response));
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(statusLapanganActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

function* getDropdownOptions(props: PayloadAction<any>) {
  try {
    yield put(statusLapanganActions.requestDropdownOptions());

    const params: RootState["statusLapangan"]["params"] = yield select(
      (state: RootState) => state.statusLapangan.params
    );

    const response: Awaited<ReturnType<typeof getDropdownStatusLapangan>> =
      yield getDropdownStatusLapangan({ ...params, ...props.payload });

    yield put(
      statusLapanganActions.receiveDropdownOptions({
        column: props.payload.column,
        options: response,
      })
    );
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(statusLapanganActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchGetStatusLapanganAsync() {
  yield takeEvery(GET_STATUS_LAPANGAN, getDatatable);
  yield takeEvery(GET_STATUS_LAPANGAN_DROPDOWN, getDropdownOptions);
}
