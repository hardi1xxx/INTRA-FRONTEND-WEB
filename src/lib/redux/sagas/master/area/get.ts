import { areaActions } from "@/lib/redux/slices/master/area";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { GET_AREA, GET_AREA_DROPDOWN } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { getDropdownArea, getAreaDatatable } from "@/lib/services";
import { RootState } from "@/lib/redux/store";
import { PayloadAction } from "@reduxjs/toolkit";

function* getDatatable() {
  try {
    yield put(areaActions.request());

    const params: RootState["area"]["params"] = yield select(
      (state: RootState) => state.area.params
    );

    const response: Awaited<ReturnType<typeof getAreaDatatable>> =
      yield getAreaDatatable(params);

    yield put(areaActions.receive(response));
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(areaActions.error(message));
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
    yield put(areaActions.requestDropdownOptions());

    const params: RootState["area"]["params"] = yield select(
      (state: RootState) => state.area.params
    );

    const response: Awaited<ReturnType<typeof getDropdownArea>> =
      yield getDropdownArea({ ...params, ...props.payload });

    yield put(
      areaActions.receiveDropdownOptions({
        column: props.payload.column,
        options: response,
      })
    );
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(areaActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchGetAreaAsync() {
  yield takeEvery(GET_AREA, getDatatable);
  yield takeEvery(GET_AREA_DROPDOWN, getDropdownOptions);
}
