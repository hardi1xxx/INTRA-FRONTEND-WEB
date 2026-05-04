import { batchActions } from "@/lib/redux/slices/master/batch";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { CREATE_BATCH, DELETE_BATCH, GET_BATCH, UPDATE_BATCH, UPDATE_STATUS_BATCH } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { createBatch, deleteBatch, updateBatch, updateStatusBatch } from "@/lib/services";
import { PayloadAction } from "@reduxjs/toolkit";
import { UpsertBatchRequest } from "@/app/(postlogin)/master/batch/schema";
import { WithId } from "@/type/services";

function* updateStatus(props: PayloadAction<{ id: number; status: 0 | 1 }>) {
  try {
    yield put(batchActions.request());

    try {
      const response: Awaited<ReturnType<typeof updateStatusBatch>> =
        yield updateStatusBatch(props.payload);
    } catch (error) {}

    yield put(
      setTextNotification({
        text: "Status has been updated successfully",
        severity: "success",
      })
    );

    yield put({ type: GET_BATCH });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(batchActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

function* create(props: PayloadAction<UpsertBatchRequest>) {
  try {
    yield put(batchActions.request());

    const response: Awaited<ReturnType<typeof createBatch>> =
      yield createBatch(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_BATCH });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(batchActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

function* update(props: PayloadAction<UpsertBatchRequest & WithId>) {
  try {
    yield put(batchActions.request());

    const response: Awaited<ReturnType<typeof updateBatch>> =
      yield updateBatch(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_BATCH });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(batchActions.error(message));
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
    yield put(batchActions.request());

    const response: Awaited<ReturnType<typeof deleteBatch>> =
      yield deleteBatch(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_BATCH });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(batchActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchUpdateBatchAsync() {
  yield takeEvery(UPDATE_STATUS_BATCH, updateStatus);
  yield takeEvery(CREATE_BATCH, create);
  yield takeEvery(UPDATE_BATCH, update);
  yield takeEvery(DELETE_BATCH, deleteData);
}
