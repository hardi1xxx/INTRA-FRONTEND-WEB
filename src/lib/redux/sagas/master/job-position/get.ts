import { jobPositionActions } from "@/lib/redux/slices/master/job-position";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { GET_MASTER_JOB_POSITION, GET_MASTER_JOB_POSITION_DROPDOWN } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { getDropdownJobPosition, getJobPositionDatatable } from "@/lib/services";
import { RootState } from "@/lib/redux/store";
import { PayloadAction } from "@reduxjs/toolkit";

function* getDatatable() {
  try {
    yield put(jobPositionActions.request());

    const params: RootState["jobPosition"]["params"] = yield select((state: RootState) => state.jobPosition.params);

    const response: Awaited<ReturnType<typeof getJobPositionDatatable>> = yield getJobPositionDatatable(params);

    yield put(jobPositionActions.receive(response));
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(jobPositionActions.error(message));
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
    yield put(jobPositionActions.requestDropdownOptions());

    const params: RootState["jobPosition"]["params"] = yield select((state: RootState) => state.jobPosition.params);

    const response: Awaited<ReturnType<typeof getDropdownJobPosition>> = yield getDropdownJobPosition({ ...params, ...props.payload, length: 10 });

    yield put(
      jobPositionActions.receiveDropdownOptions({
        column: props.payload.column,
        options: response,
      })
    );

    if (response.length < 1) {
      throw new Error("Data not available");
    }
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(jobPositionActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchGetJobPositionAsync() {
  yield takeEvery(GET_MASTER_JOB_POSITION, getDatatable);
  yield takeEvery(GET_MASTER_JOB_POSITION_DROPDOWN, getDropdownOptions);
}
