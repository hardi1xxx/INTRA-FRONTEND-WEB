import { regionalActions } from "@/lib/redux/slices/master/regional";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { CREATE_REGIONAL, DELETE_REGIONAL, GET_REGIONAL, UPDATE_REGIONAL, UPDATE_STATUS_REGIONAL } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { createRegional, deleteRegional, updateRegional, updateStatusRegional } from "@/lib/services";
import { PayloadAction } from "@reduxjs/toolkit";
import { UpsertRegionalRequest } from "@/app/(postlogin)/master/regional/schema";
import { WithId } from "@/type/services";

function* updateStatus(props: PayloadAction<{ id: number; status: 0 | 1 }>) {
  try {
    yield put(regionalActions.request());

    try {
      const response: Awaited<ReturnType<typeof updateStatusRegional>> =
        yield updateStatusRegional(props.payload);
    } catch (error) {}

    yield put(
      setTextNotification({
        text: "Status has been updated successfully",
        severity: "success",
      })
    );

    yield put({ type: GET_REGIONAL });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(regionalActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

function* create(props: PayloadAction<UpsertRegionalRequest>) {
  try {
    yield put(regionalActions.request());

    const response: Awaited<ReturnType<typeof createRegional>> =
      yield createRegional(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_REGIONAL });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(regionalActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

function* update(props: PayloadAction<UpsertRegionalRequest & WithId>) {
  try {
    yield put(regionalActions.request());

    const response: Awaited<ReturnType<typeof updateRegional>> =
      yield updateRegional(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_REGIONAL });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(regionalActions.error(message));
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
    yield put(regionalActions.request());

    const response: Awaited<ReturnType<typeof deleteRegional>> =
      yield deleteRegional(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_REGIONAL });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(regionalActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchUpdateRegionalAsync() {
  yield takeEvery(UPDATE_STATUS_REGIONAL, updateStatus);
  yield takeEvery(CREATE_REGIONAL, create);
  yield takeEvery(UPDATE_REGIONAL, update);
  yield takeEvery(DELETE_REGIONAL, deleteData);
}
