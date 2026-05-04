import { stoActions } from "@/lib/redux/slices/master/sto";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { GET_STO, GET_STO_DROPDOWN } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { getDropdownSTO, getSTODatatable } from "@/lib/services";
import { RootState } from "@/lib/redux/store";
import { PayloadAction } from "@reduxjs/toolkit";

function* getDatatable() {
  try {
    yield put(stoActions.request());

    const params: RootState["sto"]["params"] = yield select(
      (state: RootState) => state.sto.params
    );

    const response: Awaited<ReturnType<typeof getSTODatatable>> =
      yield getSTODatatable(params);

    yield put(stoActions.receive(response));
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

function* getDropdownOptions(props: PayloadAction<any>) {
  try {
    yield put(stoActions.requestDropdownOptions());

    const params: RootState["sto"]["params"] = yield select(
      (state: RootState) => state.sto.params
    );

    const response: Awaited<ReturnType<typeof getDropdownSTO>> =
      yield getDropdownSTO({ ...params, ...props.payload });

    yield put(
      stoActions.receiveDropdownOptions({
        column: props.payload.column,
        options: response,
      })
    );
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

export function* watchGetSTOAsync() {
  yield takeEvery(GET_STO, getDatatable);
  yield takeEvery(GET_STO_DROPDOWN, getDropdownOptions);
}
