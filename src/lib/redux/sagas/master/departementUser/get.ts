import { setTextNotification } from "@/lib/redux/slices/notification";
import {
  GET_MASTER_DEPARTEMENT_USER,
  GET_MASTER_DEPARTEMENT_USER_DROPDOWN,
} from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { RootState } from "@/lib/redux/store";
import { PayloadAction } from "@reduxjs/toolkit";
import { departementUserActions } from "@/lib/redux/slices/master/departementUser";
import {
  getDropdownDepartementUser,
  getDepartementUserDatatable,
} from "@/lib/services";
import { DropdownOptions } from "@/type/services";

function* getDatatable() {
  try {
    yield put(departementUserActions.request());

    const params: RootState["departementUser"]["params"] = yield select(
      (state: RootState) => state.departementUser.params
    );

    const response: Awaited<ReturnType<typeof getDepartementUserDatatable>> =
      yield getDepartementUserDatatable(params);

    yield put(departementUserActions.receive(response));
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

function* getDropdownOptions(props: PayloadAction<any>) {
  try {
    yield put(departementUserActions.requestDropdownOptions());

    const params: RootState["departementUser"]["params"] = yield select(
      (state: RootState) => state.departementUser.params
    );

    const response: Awaited<ReturnType<typeof getDropdownDepartementUser>> =
      yield getDropdownDepartementUser({ ...params, ...props.payload, length: 10 });

    yield put(
      departementUserActions.receiveDropdownOptions({
        column: props.payload.column,
        options: response,
      })
    );

    if (response.filter((item: DropdownOptions) => RegExp(props.payload[props.payload.column].toLowerCase()).exec(item.value.toString().toLowerCase())).length === 0) {
      yield put(setTextNotification({
        text: "Data not available.",
        severity: "error",
      }))
    }
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

export function* watchGetDepartementUserAsync() {
  yield takeEvery(GET_MASTER_DEPARTEMENT_USER, getDatatable);
  yield takeEvery(GET_MASTER_DEPARTEMENT_USER_DROPDOWN, getDropdownOptions);
}
