import { stoActions } from "@/lib/redux/slices/master/sto";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { CREATE_STO, DELETE_STO, GET_STO, UPDATE_STO, UPDATE_STATUS_STO } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { createSTO, deleteSTO, updateSTO, updateStatusSTO } from "@/lib/services";
import { PayloadAction } from "@reduxjs/toolkit";
import { UpsertSTORequest } from "@/app/(postlogin)/master/sto/schema";
import { WithId } from "@/type/services";

function* updateStatus(props: PayloadAction<{ id: number; status: 0 | 1 }>) {
  try {
    yield put(stoActions.request());

    try {
      const response: Awaited<ReturnType<typeof updateStatusSTO>> =
        yield updateStatusSTO(props.payload);
    } catch (error) {}

    yield put(
      setTextNotification({
        text: "Status has been updated successfully",
        severity: "success",
      })
    );

    yield put({ type: GET_STO });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(stoActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

function* create(props: PayloadAction<UpsertSTORequest>) {
  try {
    yield put(stoActions.request());

    const response: Awaited<ReturnType<typeof createSTO>> =
      yield createSTO(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_STO });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(stoActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

function* update(props: PayloadAction<UpsertSTORequest & WithId>) {
  try {
    yield put(stoActions.request());

    const response: Awaited<ReturnType<typeof updateSTO>> =
      yield updateSTO(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_STO });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(stoActions.error(message));
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
    yield put(stoActions.request());

    const response: Awaited<ReturnType<typeof deleteSTO>> =
      yield deleteSTO(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_STO });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(stoActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchUpdateSTOAsync() {
  yield takeEvery(UPDATE_STATUS_STO, updateStatus);
  yield takeEvery(CREATE_STO, create);
  yield takeEvery(UPDATE_STO, update);
  yield takeEvery(DELETE_STO, deleteData);
}
