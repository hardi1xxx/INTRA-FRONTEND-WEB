import { regionalActions } from "@/lib/redux/slices/master/regional";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { GET_REGIONAL, GET_REGIONAL_DROPDOWN, GET_REGIONAL_FILTER } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { getDropdownRegional, getFilterRegional, getRegionalDatatable } from "@/lib/services";
import { RootState } from "@/lib/redux/store";
import { PayloadAction } from "@reduxjs/toolkit";

function* getDatatable() {
  try {
    yield put(regionalActions.request());

    const params: RootState["regional"]["params"] = yield select(
      (state: RootState) => state.regional.params
    );

    const response: Awaited<ReturnType<typeof getRegionalDatatable>> =
      yield getRegionalDatatable(params);

    yield put(regionalActions.receive(response));
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(regionalActions.error(message));
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
    yield put(regionalActions.requestDropdownOptions());

    const params: RootState["regional"]["params"] = yield select(
      (state: RootState) => state.regional.params
    );

    const response: Awaited<ReturnType<typeof getFilterRegional>> =
      yield getFilterRegional({ ...params, ...props.payload });

    yield put(
      regionalActions.receiveDropdownOptions({
        column: props.payload.column,
        options: response,
      })
    );
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(regionalActions.error(message));
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
    yield put(regionalActions.requestDropdownOptions());

    const params: RootState["regional"]["params"] = yield select(
      (state: RootState) => state.regional.params
    );

    const response: Awaited<ReturnType<typeof getDropdownRegional>> =
      yield getDropdownRegional({ ...params, ...props.payload });

    yield put(
      regionalActions.receiveDropdownOptions({
        column: props.payload.column,
        options: response,
      })
    );
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(regionalActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchGetRegionalAsync() {
  yield takeEvery(GET_REGIONAL, getDatatable);
  yield takeEvery(GET_REGIONAL_FILTER, getFilterOptions);
  yield takeEvery(GET_REGIONAL_DROPDOWN, getDropdownOptions);
}
