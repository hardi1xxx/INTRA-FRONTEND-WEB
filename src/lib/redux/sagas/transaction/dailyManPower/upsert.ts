import { dailyManPowerActions } from "@/lib/redux/slices/transaction/dailyManPower";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { CREATE_DAILY_MANPOWER, DELETE_DAILY_MANPOWER, GET_DAILY_MANPOWER, UPDATE_DAILY_MANPOWER } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { createDailyManPower, deleteDailyManPower, updateDailyManPower } from "@/lib/services";
import { PayloadAction } from "@reduxjs/toolkit";
import { UpsertDailyManPowerRequest } from "@/app/(postlogin)/transaction/daily-man-power/schema";
import { WithId } from "@/type/services";

function* create(props: PayloadAction<UpsertDailyManPowerRequest>) {
  try {
    yield put(dailyManPowerActions.request());

    const response: Awaited<ReturnType<typeof createDailyManPower>> =
      yield createDailyManPower(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_DAILY_MANPOWER });
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

function* update(props: PayloadAction<UpsertDailyManPowerRequest & WithId>) {
  try {
    yield put(dailyManPowerActions.request());

    const response: Awaited<ReturnType<typeof updateDailyManPower>> =
      yield updateDailyManPower(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_DAILY_MANPOWER });
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
function* deleteData(props: PayloadAction<WithId>) {
  try {
    yield put(dailyManPowerActions.request());

    const response: Awaited<ReturnType<typeof deleteDailyManPower>> =
      yield deleteDailyManPower(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_DAILY_MANPOWER });
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

export function* watchUpdateDailyManPowerAsync() {
  yield takeEvery(CREATE_DAILY_MANPOWER, create);
  yield takeEvery(UPDATE_DAILY_MANPOWER, update);
  yield takeEvery(DELETE_DAILY_MANPOWER, deleteData);
}
