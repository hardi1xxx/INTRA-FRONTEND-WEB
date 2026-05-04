import { mitraActions } from "@/lib/redux/slices/master/mitra";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { CREATE_MITRA, DELETE_MITRA, GET_MITRA, UPDATE_MITRA, UPDATE_STATUS_MITRA } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { createMitra, deleteMitra, updateMitra, updateStatusMitra } from "@/lib/services";
import { PayloadAction } from "@reduxjs/toolkit";
import { UpsertMitraRequest } from "@/app/(postlogin)/master/mitra/schema";
import { WithId } from "@/type/services";

function* updateStatus(props: PayloadAction<{ id: number; status: 0 | 1 }>) {
  try {
    yield put(mitraActions.request());

    try {
      const response: Awaited<ReturnType<typeof updateStatusMitra>> =
        yield updateStatusMitra(props.payload);
    } catch (error) {}

    yield put(
      setTextNotification({
        text: "Status has been updated successfully",
        severity: "success",
      })
    );

    yield put({ type: GET_MITRA });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(mitraActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

function* create(props: PayloadAction<UpsertMitraRequest>) {
  try {
    yield put(mitraActions.request());

    const response: Awaited<ReturnType<typeof createMitra>> =
      yield createMitra(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_MITRA });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(mitraActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

function* update(props: PayloadAction<UpsertMitraRequest & WithId>) {
  try {
    yield put(mitraActions.request());

    const response: Awaited<ReturnType<typeof updateMitra>> =
      yield updateMitra(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_MITRA });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(mitraActions.error(message));
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
    yield put(mitraActions.request());

    const response: Awaited<ReturnType<typeof deleteMitra>> =
      yield deleteMitra(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_MITRA });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(mitraActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchUpdateMitraAsync() {
  yield takeEvery(UPDATE_STATUS_MITRA, updateStatus);
  yield takeEvery(CREATE_MITRA, create);
  yield takeEvery(UPDATE_MITRA, update);
  yield takeEvery(DELETE_MITRA, deleteData);
}
