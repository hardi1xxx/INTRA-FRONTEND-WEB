import { witelActions } from "@/lib/redux/slices/master/witel";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { GET_WITEL, GET_WITEL_DROPDOWN } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { getDropdownWitel, getWitelDatatable } from "@/lib/services";
import { RootState } from "@/lib/redux/store";
import { PayloadAction } from "@reduxjs/toolkit";

function* getDatatable() {
  try {
    yield put(witelActions.request());

    const params: RootState["witel"]["params"] = yield select(
      (state: RootState) => state.witel.params
    );

    const response: Awaited<ReturnType<typeof getWitelDatatable>> =
      yield getWitelDatatable(params);

    yield put(witelActions.receive(response));
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(witelActions.error(message));
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
    yield put(witelActions.requestDropdownOptions());

    const params: RootState["witel"]["params"] = yield select(
      (state: RootState) => state.witel.params
    );

    const response: Awaited<ReturnType<typeof getDropdownWitel>> =
      yield getDropdownWitel({ ...params, ...props.payload });

    yield put(
      witelActions.receiveDropdownOptions({
        column: props.payload.column,
        options: response,
      })
    );
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(witelActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchGetWitelAsync() {
  yield takeEvery(GET_WITEL, getDatatable);
  yield takeEvery(GET_WITEL_DROPDOWN, getDropdownOptions);
}
