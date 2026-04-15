import { witelActions } from "@/lib/redux/slices/master/witel";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { CREATE_WITEL, DELETE_WITEL, GET_WITEL, UPDATE_WITEL, UPDATE_STATUS_WITEL } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { createWitel, deleteWitel, updateWitel, updateStatusWitel } from "@/lib/services";
import { PayloadAction } from "@reduxjs/toolkit";
import { UpsertWitelRequest } from "@/app/(postlogin)/master/witel/schema";
import { WithId } from "@/type/services";

function* updateStatus(props: PayloadAction<{ id: number; status: 0 | 1 }>) {
  try {
    yield put(witelActions.request());

    try {
      const response: Awaited<ReturnType<typeof updateStatusWitel>> =
        yield updateStatusWitel(props.payload);
    } catch (error) {}

    yield put(
      setTextNotification({
        text: "Status has been updated successfully",
        severity: "success",
      })
    );

    yield put({ type: GET_WITEL });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(witelActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

function* create(props: PayloadAction<UpsertWitelRequest>) {
  try {
    yield put(witelActions.request());

    const response: Awaited<ReturnType<typeof createWitel>> =
      yield createWitel(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_WITEL });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(witelActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

function* update(props: PayloadAction<UpsertWitelRequest & WithId>) {
  try {
    yield put(witelActions.request());

    const response: Awaited<ReturnType<typeof updateWitel>> =
      yield updateWitel(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_WITEL });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(witelActions.error(message));
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
    yield put(witelActions.request());

    const response: Awaited<ReturnType<typeof deleteWitel>> =
      yield deleteWitel(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_WITEL });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(witelActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchUpdateWitelAsync() {
  yield takeEvery(UPDATE_STATUS_WITEL, updateStatus);
  yield takeEvery(CREATE_WITEL, create);
  yield takeEvery(UPDATE_WITEL, update);
  yield takeEvery(DELETE_WITEL, deleteData);
}
