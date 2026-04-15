import { reportPT3Actions } from "@/lib/redux/slices/report/reportPT3";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { GET_REPORT_PT3, GET_REPORT_PT3_DROPDOWN } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { getDropdownReportPT3, getReportPT3Datatable } from "@/lib/services";
import { RootState } from "@/lib/redux/store";
import { PayloadAction } from "@reduxjs/toolkit";

function* getDatatable() {
  try {
    yield put(reportPT3Actions.request());

    const params: RootState["reportPT3"]["params"] = yield select(
      (state: RootState) => state.reportPT3.params
    );

    const response: Awaited<ReturnType<typeof getReportPT3Datatable>> =
      yield getReportPT3Datatable(params);

    yield put(reportPT3Actions.receive(response));
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(reportPT3Actions.error(message));
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
    yield put(reportPT3Actions.requestDropdownOptions());

    const params: RootState["reportPT3"]["params"] = yield select(
      (state: RootState) => state.reportPT3.params
    );

    const response: Awaited<ReturnType<typeof getDropdownReportPT3>> =
      yield getDropdownReportPT3({ ...params, ...props.payload });

    yield put(
      reportPT3Actions.receiveDropdownOptions({
        column: props.payload.column,
        options: response,
      })
    );
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(reportPT3Actions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchGetReportPT3Async() {
  yield takeEvery(GET_REPORT_PT3, getDatatable);
  yield takeEvery(GET_REPORT_PT3_DROPDOWN, getDropdownOptions);
}
