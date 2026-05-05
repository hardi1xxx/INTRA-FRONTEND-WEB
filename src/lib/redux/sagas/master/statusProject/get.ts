import { statusProjectActions } from "@/lib/redux/slices/master/statusProject";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { GET_STATUS_PROJECT, GET_STATUS_PROJECT_DROPDOWN } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { getDropdownStatusProject, getFilterStatusProject, getStatusProjectDatatable } from "@/lib/services";
import { RootState } from "@/lib/redux/store";
import { PayloadAction } from "@reduxjs/toolkit";

function* getDatatable() {
  try {
    yield put(statusProjectActions.request());

    const params: RootState["statusProject"]["params"] = yield select(
      (state: RootState) => state.statusProject.params
    );

    const response: Awaited<ReturnType<typeof getStatusProjectDatatable>> =
      yield getStatusProjectDatatable(params);

    yield put(statusProjectActions.receive(response));
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

function* getFilterOptions(props: PayloadAction<any>) {
  try {
    yield put(statusProjectActions.requestDropdownOptions());

    const params: RootState["statusProject"]["params"] = yield select(
      (state: RootState) => state.statusProject.params
    );

    const response: Awaited<ReturnType<typeof getFilterStatusProject>> =
      yield getFilterStatusProject({ ...params, ...props.payload });

    yield put(
      statusProjectActions.receiveDropdownOptions({
        column: props.payload.column,
        options: response,
      })
    );
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

function* getDropdownOptions(props: PayloadAction<any>) {
  try {
    yield put(statusProjectActions.requestDropdownOptions());

    const params: RootState["statusProject"]["params"] = yield select(
      (state: RootState) => state.statusProject.params
    );

    const response: Awaited<ReturnType<typeof getDropdownStatusProject>> =
      yield getDropdownStatusProject({ ...params, ...props.payload });

    yield put(
      statusProjectActions.receiveDropdownOptions({
        column: props.payload.column,
        options: response,
      })
    );
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

export function* watchGetStatusProjectAsync() {
  yield takeEvery(GET_STATUS_PROJECT, getDatatable);
  yield takeEvery(GET_STATUS_PROJECT_DROPDOWN, getDropdownOptions);
}
