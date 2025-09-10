import { jobPositionActions } from "@/lib/redux/slices/master/job-position";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { CREATE_MASTER_JOB_POSITION, DELETE_MASTER_JOB_POSITION, GET_MASTER_JOB_POSITION, UPDATE_MASTER_JOB_POSITION, UPDATE_STATUS_MASTER_JOB_POSITION } from "@/lib/redux/types";
import { put, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { createJobPosition, deleteJobPosition, updateJobPosition, updateStatusJobPosition } from "@/lib/services";
import { PayloadAction } from "@reduxjs/toolkit";
import { UpsertJobPositionRequest } from "@/app/(postlogin)/setting/job-position/schema";
import { WithId } from "@/type/services";

function* create(props: PayloadAction<UpsertJobPositionRequest>) {
  try {
    yield put(jobPositionActions.request());

    const response: Awaited<ReturnType<typeof createJobPosition>> = yield createJobPosition(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_MASTER_JOB_POSITION });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(jobPositionActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

function* update(props: PayloadAction<UpsertJobPositionRequest & WithId>) {
  try {
    yield put(jobPositionActions.request());

    const response: Awaited<ReturnType<typeof updateJobPosition>> = yield updateJobPosition(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_MASTER_JOB_POSITION });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(jobPositionActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

function* updateStatus(props: PayloadAction<{ id: number; status: 0 | 1 }>) {
  try {
    yield put(jobPositionActions.request());

    try {
      const response: Awaited<ReturnType<typeof updateStatusJobPosition>> = yield updateStatusJobPosition(props.payload);
    } catch (error) {}

    yield put(
      setTextNotification({
        text: "Status has been updated successfully",
        severity: "success",
      })
    );

    yield put({ type: GET_MASTER_JOB_POSITION });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(jobPositionActions.error(message));
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
    yield put(jobPositionActions.request());

    const response: Awaited<ReturnType<typeof deleteJobPosition>> = yield deleteJobPosition(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_MASTER_JOB_POSITION });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(jobPositionActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchUpdateJobPositionAsync() {
  yield takeEvery(CREATE_MASTER_JOB_POSITION, create);
  yield takeEvery(UPDATE_MASTER_JOB_POSITION, update);
  yield takeEvery(UPDATE_STATUS_MASTER_JOB_POSITION, updateStatus);
  yield takeEvery(DELETE_MASTER_JOB_POSITION, deleteData);
}
