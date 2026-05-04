import { branchActions } from "@/lib/redux/slices/master/branch";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { GET_BRANCH, GET_BRANCH_DROPDOWN } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { getDropdownBranch, getBranchDatatable } from "@/lib/services";
import { RootState } from "@/lib/redux/store";
import { PayloadAction } from "@reduxjs/toolkit";

function* getDatatable() {
  try {
    yield put(branchActions.request());

    const params: RootState["branch"]["params"] = yield select(
      (state: RootState) => state.branch.params
    );

    const response: Awaited<ReturnType<typeof getBranchDatatable>> =
      yield getBranchDatatable(params);

    yield put(branchActions.receive(response));
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(branchActions.error(message));
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
    yield put(branchActions.requestDropdownOptions());

    const params: RootState["branch"]["params"] = yield select(
      (state: RootState) => state.branch.params
    );

    const response: Awaited<ReturnType<typeof getDropdownBranch>> =
      yield getDropdownBranch({ ...params, ...props.payload });

    yield put(
      branchActions.receiveDropdownOptions({
        column: props.payload.column,
        options: response,
      })
    );
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(branchActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchGetBranchAsync() {
  yield takeEvery(GET_BRANCH, getDatatable);
  yield takeEvery(GET_BRANCH_DROPDOWN, getDropdownOptions);
}
