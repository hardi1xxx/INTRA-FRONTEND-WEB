import { areaActions } from "@/lib/redux/slices/master/area";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { CREATE_AREA, DELETE_AREA, GET_AREA, UPDATE_AREA, UPDATE_STATUS_AREA } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { createArea, deleteArea, updateArea, updateStatusArea } from "@/lib/services";
import { PayloadAction } from "@reduxjs/toolkit";
import { UpsertAreaRequest } from "@/app/(postlogin)/master/area/schema";
import { WithId } from "@/type/services";

function* updateStatus(props: PayloadAction<{ id: number; status: 0 | 1 }>) {
  try {
    yield put(areaActions.request());

    try {
      const response: Awaited<ReturnType<typeof updateStatusArea>> =
        yield updateStatusArea(props.payload);
    } catch (error) {}

    yield put(
      setTextNotification({
        text: "Status has been updated successfully",
        severity: "success",
      })
    );

    yield put({ type: GET_AREA });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(areaActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

function* create(props: PayloadAction<UpsertAreaRequest>) {
  try {
    yield put(areaActions.request());

    const response: Awaited<ReturnType<typeof createArea>> =
      yield createArea(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_AREA });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(areaActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

function* update(props: PayloadAction<UpsertAreaRequest & WithId>) {
  try {
    yield put(areaActions.request());

    const response: Awaited<ReturnType<typeof updateArea>> =
      yield updateArea(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_AREA });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(areaActions.error(message));
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
    yield put(areaActions.request());

    const response: Awaited<ReturnType<typeof deleteArea>> =
      yield deleteArea(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_AREA });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(areaActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchUpdateAreaAsync() {
  yield takeEvery(UPDATE_STATUS_AREA, updateStatus);
  yield takeEvery(CREATE_AREA, create);
  yield takeEvery(UPDATE_AREA, update);
  yield takeEvery(DELETE_AREA, deleteData);
}
