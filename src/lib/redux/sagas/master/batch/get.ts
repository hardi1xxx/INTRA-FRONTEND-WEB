import { batchActions } from "@/lib/redux/slices/master/batch";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { GET_BATCH, GET_BATCH_DROPDOWN } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { getDropdownBatch, getBatchDatatable } from "@/lib/services";
import { RootState } from "@/lib/redux/store";
import { PayloadAction } from "@reduxjs/toolkit";

function* getDatatable() {
  try {
    yield put(batchActions.request());

    const params: RootState["batch"]["params"] = yield select(
      (state: RootState) => state.batch.params
    );

    const response: Awaited<ReturnType<typeof getBatchDatatable>> =
      yield getBatchDatatable(params);

    yield put(batchActions.receive(response));
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(batchActions.error(message));
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
    yield put(batchActions.requestDropdownOptions());

    const params: RootState["batch"]["params"] = yield select(
      (state: RootState) => state.batch.params
    );

    const response: Awaited<ReturnType<typeof getDropdownBatch>> =
      yield getDropdownBatch({ ...params, ...props.payload });

    yield put(
      batchActions.receiveDropdownOptions({
        column: props.payload.column,
        options: response,
      })
    );
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(batchActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchGetBatchAsync() {
  yield takeEvery(GET_BATCH, getDatatable);
  yield takeEvery(GET_BATCH_DROPDOWN, getDropdownOptions);
}
