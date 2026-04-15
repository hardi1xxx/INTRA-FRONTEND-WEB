import { statusLapanganActions } from "@/lib/redux/slices/master/statusLapangan";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { CREATE_STATUS_LAPANGAN, DELETE_STATUS_LAPANGAN, GET_STATUS_LAPANGAN, UPDATE_STATUS_LAPANGAN, UPDATE_STATUS_STATUS_LAPANGAN } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { createStatusLapangan, deleteStatusLapangan, updateStatusLapangan, updateStatusStatusLapangan } from "@/lib/services";
import { PayloadAction } from "@reduxjs/toolkit";
import { UpsertStatusLapanganRequest } from "@/app/(postlogin)/master/status-lapangan/schema";
import { WithId } from "@/type/services";

function* updateStatus(props: PayloadAction<{ id: number; status: 0 | 1 }>) {
  try {
    yield put(statusLapanganActions.request());

    try {
      const response: Awaited<ReturnType<typeof updateStatusStatusLapangan>> =
        yield updateStatusStatusLapangan(props.payload);
    } catch (error) {}

    yield put(
      setTextNotification({
        text: "Status has been updated successfully",
        severity: "success",
      })
    );

    yield put({ type: GET_STATUS_LAPANGAN });
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

function* create(props: PayloadAction<UpsertStatusLapanganRequest>) {
  try {
    yield put(statusLapanganActions.request());

    const response: Awaited<ReturnType<typeof createStatusLapangan>> =
      yield createStatusLapangan(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_STATUS_LAPANGAN });
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

function* update(props: PayloadAction<UpsertStatusLapanganRequest & WithId>) {
  try {
    yield put(statusLapanganActions.request());

    const response: Awaited<ReturnType<typeof updateStatusLapangan>> =
      yield updateStatusLapangan(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_STATUS_LAPANGAN });
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
function* deleteData(props: PayloadAction<WithId>) {
  try {
    yield put(statusLapanganActions.request());

    const response: Awaited<ReturnType<typeof deleteStatusLapangan>> =
      yield deleteStatusLapangan(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_STATUS_LAPANGAN });
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

export function* watchUpdateStatusLapanganAsync() {
  yield takeEvery(UPDATE_STATUS_STATUS_LAPANGAN, updateStatus);
  yield takeEvery(CREATE_STATUS_LAPANGAN, create);
  yield takeEvery(UPDATE_STATUS_LAPANGAN, update);
  yield takeEvery(DELETE_STATUS_LAPANGAN, deleteData);
}
