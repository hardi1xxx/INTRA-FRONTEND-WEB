import { categoryProjectActions } from "@/lib/redux/slices/master/categoryProject";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { GET_CATEGORY_PROJECT, GET_CATEGORY_PROJECT_DROPDOWN, GET_CATEGORY_PROJECT_FILTER } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { getFilterCategoryProject, getCategoryProjectDatatable, getDropdownCategoryProject } from "@/lib/services";
import { RootState } from "@/lib/redux/store";
import { PayloadAction } from "@reduxjs/toolkit";

function* getDatatable() {
  try {
    yield put(categoryProjectActions.request());

    const params: RootState["categoryProject"]["params"] = yield select(
      (state: RootState) => state.categoryProject.params
    );

    const response: Awaited<ReturnType<typeof getCategoryProjectDatatable>> =
      yield getCategoryProjectDatatable(params);

    yield put(categoryProjectActions.receive(response));
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

function* getFilterOptions(props: PayloadAction<any>) {
  try {
    yield put(categoryProjectActions.requestDropdownOptions());

    const params: RootState["categoryProject"]["params"] = yield select(
      (state: RootState) => state.categoryProject.params
    );

    const response: Awaited<ReturnType<typeof getFilterCategoryProject>> =
      yield getFilterCategoryProject({ ...params, ...props.payload });

    yield put(
      categoryProjectActions.receiveDropdownOptions({
        column: props.payload.column,
        options: response,
      })
    );
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

function* getDropdownOptions(props: PayloadAction<any>) {
  try {
    yield put(categoryProjectActions.requestDropdownOptions());

    const params: RootState["categoryProject"]["params"] = yield select(
      (state: RootState) => state.categoryProject.params
    );

    const response: Awaited<ReturnType<typeof getDropdownCategoryProject>> =
      yield getDropdownCategoryProject({ ...params, ...props.payload });

    yield put(
      categoryProjectActions.receiveDropdownOptions({
        column: props.payload.column,
        options: response,
      })
    );
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

export function* watchGetCategoryProjectAsync() {
  yield takeEvery(GET_CATEGORY_PROJECT, getDatatable);
  yield takeEvery(GET_CATEGORY_PROJECT_FILTER, getFilterOptions);
  yield takeEvery(GET_CATEGORY_PROJECT_DROPDOWN, getDropdownOptions);
}
