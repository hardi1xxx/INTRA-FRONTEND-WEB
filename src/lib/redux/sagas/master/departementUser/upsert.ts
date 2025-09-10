import { setTextNotification } from "@/lib/redux/slices/notification";
import {
  CREATE_MASTER_DEPARTEMENT_USER,
  DELETE_MASTER_DEPARTEMENT_USER,
  GET_MASTER_DEPARTEMENT_USER,
  UPDATE_MASTER_DEPARTEMENT_USER,
  UPDATE_STATUS_MASTER_DEPARTEMENT_USER,
} from "@/lib/redux/types";
import { put, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import {
  createDepartementUser,
  deleteDepartementUser,
  updateDepartementUser,
  updateStatusDepartementUser,
} from "@/lib/services";
import { PayloadAction } from "@reduxjs/toolkit";
import { WithId } from "@/type/services";
import { departementUserActions } from "@/lib/redux/slices/master/departementUser";
import { UpsertDepartementUserRequest } from "@/lib/services/master/departementUser";

function* updateStatus(props: PayloadAction<{ id: number; status: 0 | 1 }>) {
  try {
    yield put(departementUserActions.request());

    yield updateStatusDepartementUser(props.payload);

    yield put({ type: GET_MASTER_DEPARTEMENT_USER });

    yield put(
      setTextNotification({
        text: "Status has been updated successfully",
        severity: "success",
      })
    );
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(departementUserActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

function* create(props: PayloadAction<UpsertDepartementUserRequest>) {
  try {
    yield put(departementUserActions.request());

    const response: Awaited<ReturnType<typeof createDepartementUser>> =
      yield createDepartementUser(props.payload);

    yield put({ type: GET_MASTER_DEPARTEMENT_USER });

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(departementUserActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

function* update(props: PayloadAction<UpsertDepartementUserRequest & WithId>) {
  try {
    yield put(departementUserActions.request());

    const response: Awaited<ReturnType<typeof updateDepartementUser>> =
      yield updateDepartementUser(props.payload);

    yield put({ type: GET_MASTER_DEPARTEMENT_USER });

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(departementUserActions.error(message));
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
    yield put(departementUserActions.request());

    const response: Awaited<ReturnType<typeof deleteDepartementUser>> =
      yield deleteDepartementUser(props.payload);

    yield put({ type: GET_MASTER_DEPARTEMENT_USER });

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(departementUserActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchUpdateDepartementUserAsync() {
  yield takeEvery(UPDATE_STATUS_MASTER_DEPARTEMENT_USER, updateStatus);
  yield takeEvery(CREATE_MASTER_DEPARTEMENT_USER, create);
  yield takeEvery(UPDATE_MASTER_DEPARTEMENT_USER, update);
  yield takeEvery(DELETE_MASTER_DEPARTEMENT_USER, deleteData);
}
