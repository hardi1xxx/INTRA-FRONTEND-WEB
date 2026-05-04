import { statusProjectActions } from "@/lib/redux/slices/master/statusProject";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { CREATE_STATUS_PROJECT, DELETE_STATUS_PROJECT, GET_STATUS_PROJECT, UPDATE_STATUS_PROJECT, UPDATE_STATUS_STATUS_PROJECT } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { createStatusProject, deleteStatusProject, updateStatusProject, updateStatusStatusProject } from "@/lib/services";
import { PayloadAction } from "@reduxjs/toolkit";
import { UpsertStatusProjectRequest } from "@/app/(postlogin)/master/status-project/schema";
import { WithId } from "@/type/services";

function* updateStatus(props: PayloadAction<{ id: number; status: 0 | 1 }>) {
  try {
    yield put(statusProjectActions.request());

    try {
      const response: Awaited<ReturnType<typeof updateStatusStatusProject>> =
        yield updateStatusStatusProject(props.payload);
    } catch (error) {}

    yield put(
      setTextNotification({
        text: "Status has been updated successfully",
        severity: "success",
      })
    );

    yield put({ type: GET_STATUS_PROJECT });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(statusProjectActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

function* create(props: PayloadAction<UpsertStatusProjectRequest>) {
  try {
    yield put(statusProjectActions.request());

    const response: Awaited<ReturnType<typeof createStatusProject>> =
      yield createStatusProject(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_STATUS_PROJECT });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(statusProjectActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

function* update(props: PayloadAction<UpsertStatusProjectRequest & WithId>) {
  try {
    yield put(statusProjectActions.request());

    const response: Awaited<ReturnType<typeof updateStatusProject>> =
      yield updateStatusProject(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_STATUS_PROJECT });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(statusProjectActions.error(message));
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
    yield put(statusProjectActions.request());

    const response: Awaited<ReturnType<typeof deleteStatusProject>> =
      yield deleteStatusProject(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_STATUS_PROJECT });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(statusProjectActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchUpdateStatusProjectAsync() {
  yield takeEvery(UPDATE_STATUS_STATUS_PROJECT, updateStatus);
  yield takeEvery(CREATE_STATUS_PROJECT, create);
  yield takeEvery(UPDATE_STATUS_PROJECT, update);
  yield takeEvery(DELETE_STATUS_PROJECT, deleteData);
}
