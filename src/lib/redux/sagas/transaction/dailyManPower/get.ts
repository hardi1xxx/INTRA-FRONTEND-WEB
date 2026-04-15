import { dailyManPowerActions } from "@/lib/redux/slices/transaction/dailyManPower";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { GET_DAILY_MANPOWER, GET_DAILY_MANPOWER_DROPDOWN } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { getDropdownDailyManPower, getDailyManPowerDatatable } from "@/lib/services";
import { RootState } from "@/lib/redux/store";
import { PayloadAction } from "@reduxjs/toolkit";

function* getDatatable() {
  try {
    yield put(dailyManPowerActions.request());

    const params: RootState["dailyManPower"]["params"] = yield select(
      (state: RootState) => state.dailyManPower.params
    );

    const response: Awaited<ReturnType<typeof getDailyManPowerDatatable>> =
      yield getDailyManPowerDatatable(params);

    yield put(dailyManPowerActions.receive(response));
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(dailyManPowerActions.error(message));
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
    yield put(dailyManPowerActions.requestDropdownOptions());

    const params: RootState["dailyManPower"]["params"] = yield select(
      (state: RootState) => state.dailyManPower.params
    );

    const response: Awaited<ReturnType<typeof getDropdownDailyManPower>> =
      yield getDropdownDailyManPower({ ...params, ...props.payload });

    yield put(
      dailyManPowerActions.receiveDropdownOptions({
        column: props.payload.column,
        options: response,
      })
    );
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(dailyManPowerActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchGetDailyManPowerAsync() {
  yield takeEvery(GET_DAILY_MANPOWER, getDatatable);
  yield takeEvery(GET_DAILY_MANPOWER_DROPDOWN, getDropdownOptions);
}
