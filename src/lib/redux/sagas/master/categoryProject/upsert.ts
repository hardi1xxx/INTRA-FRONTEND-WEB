import { categoryProjectActions } from "@/lib/redux/slices/master/categoryProject";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { CREATE_CATEGORY_PROJECT, DELETE_CATEGORY_PROJECT, GET_CATEGORY_PROJECT, UPDATE_CATEGORY_PROJECT, UPDATE_STATUS_CATEGORY_PROJECT } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { createCategoryProject, deleteCategoryProject, updateCategoryProject, updateStatusCategoryProject } from "@/lib/services";
import { PayloadAction } from "@reduxjs/toolkit";
import { UpsertCategoryProjectRequest } from "@/app/(postlogin)/master/category-project/schema";
import { WithId } from "@/type/services";

function* updateStatus(props: PayloadAction<{ id: number; status: 0 | 1 }>) {
  try {
    yield put(categoryProjectActions.request());

    try {
      const response: Awaited<ReturnType<typeof updateStatusCategoryProject>> =
        yield updateStatusCategoryProject(props.payload);
    } catch (error) {}

    yield put(
      setTextNotification({
        text: "Status has been updated successfully",
        severity: "success",
      })
    );

    yield put({ type: GET_CATEGORY_PROJECT });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(categoryProjectActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

function* create(props: PayloadAction<UpsertCategoryProjectRequest>) {
  try {
    yield put(categoryProjectActions.request());

    const response: Awaited<ReturnType<typeof createCategoryProject>> =
      yield createCategoryProject(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_CATEGORY_PROJECT });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(categoryProjectActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

function* update(props: PayloadAction<UpsertCategoryProjectRequest & WithId>) {
  try {
    yield put(categoryProjectActions.request());

    const response: Awaited<ReturnType<typeof updateCategoryProject>> =
      yield updateCategoryProject(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_CATEGORY_PROJECT });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(categoryProjectActions.error(message));
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
    yield put(categoryProjectActions.request());

    const response: Awaited<ReturnType<typeof deleteCategoryProject>> =
      yield deleteCategoryProject(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_CATEGORY_PROJECT });
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(categoryProjectActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchUpdateCategoryProjectAsync() {
  yield takeEvery(UPDATE_STATUS_CATEGORY_PROJECT, updateStatus);
  yield takeEvery(CREATE_CATEGORY_PROJECT, create);
  yield takeEvery(UPDATE_CATEGORY_PROJECT, update);
  yield takeEvery(DELETE_CATEGORY_PROJECT, deleteData);
}
