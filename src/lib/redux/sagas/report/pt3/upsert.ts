import { reportPT3Actions } from "@/lib/redux/slices/report/reportPT3";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { CREATE_REPORT_PT3, DELETE_REPORT_PT3, GET_REPORT_PT3, UPDATE_REPORT_PT3, IMPORT_REPORT_PT3 } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { createReportPT3, deleteReportPT3, updateReportPT3, importReportPT3 } from "@/lib/services";
import { PayloadAction } from "@reduxjs/toolkit";
import { UpsertReportPT3Request } from "@/app/(postlogin)/report/pt3/schema";
import { WithId } from "@/type/services";

function* create(props: PayloadAction<UpsertReportPT3Request>) {
  try {
    yield put(reportPT3Actions.request());

    const response: Awaited<ReturnType<typeof createReportPT3>> =
      yield createReportPT3(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_REPORT_PT3 });
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

function* update(props: PayloadAction<UpsertReportPT3Request & WithId>) {
  try {
    yield put(reportPT3Actions.request());

    const response: Awaited<ReturnType<typeof updateReportPT3>> =
      yield updateReportPT3(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_REPORT_PT3 });
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
function* deleteData(props: PayloadAction<WithId>) {
  try {
    yield put(reportPT3Actions.request());

    const response: Awaited<ReturnType<typeof deleteReportPT3>> =
      yield deleteReportPT3(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_REPORT_PT3 });
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

export function* watchUpdateReportPT3Async() {
  yield takeEvery(CREATE_REPORT_PT3, create);
  yield takeEvery(UPDATE_REPORT_PT3, update);
  yield takeEvery(DELETE_REPORT_PT3, deleteData);
}
