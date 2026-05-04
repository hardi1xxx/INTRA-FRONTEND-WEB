import { branchActions } from "@/lib/redux/slices/master/branch";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { CREATE_BRANCH, DELETE_BRANCH, GET_BRANCH, UPDATE_BRANCH, UPDATE_STATUS_BRANCH } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { createBranch, deleteBranch, updateBranch, updateStatusBranch } from "@/lib/services";
import { PayloadAction } from "@reduxjs/toolkit";
import { UpsertBranchRequest } from "@/app/(postlogin)/master/branch/schema";
import { WithId } from "@/type/services";

function* updateStatus(props: PayloadAction<{ id: number; status: 0 | 1 }>) {
  try {
    yield put(branchActions.request());

    try {
      const response: Awaited<ReturnType<typeof updateStatusBranch>> =
        yield updateStatusBranch(props.payload);
    } catch (error) {}

    yield put(
      setTextNotification({
        text: "Status has been updated successfully",
        severity: "success",
      })
    );

    yield put({ type: GET_BRANCH });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(branchActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

function* create(props: PayloadAction<UpsertBranchRequest>) {
  try {
    yield put(branchActions.request());

    const response: Awaited<ReturnType<typeof createBranch>> =
      yield createBranch(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_BRANCH });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(branchActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

function* update(props: PayloadAction<UpsertBranchRequest & WithId>) {
  try {
    yield put(branchActions.request());

    const response: Awaited<ReturnType<typeof updateBranch>> =
      yield updateBranch(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_BRANCH });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(branchActions.error(message));
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
    yield put(branchActions.request());

    const response: Awaited<ReturnType<typeof deleteBranch>> =
      yield deleteBranch(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_BRANCH });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(branchActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchUpdateBranchAsync() {
  yield takeEvery(UPDATE_STATUS_BRANCH, updateStatus);
  yield takeEvery(CREATE_BRANCH, create);
  yield takeEvery(UPDATE_BRANCH, update);
  yield takeEvery(DELETE_BRANCH, deleteData);
}
