import { deleteCookie } from "cookies-next";
import { setTextNotification } from "../../slices/notification";
import { LOGOUT } from "../../types";
import { put, takeEvery } from "redux-saga/effects";
import { logout } from "@/lib/services";
import { receiveAuth, requestAuth, setAuthFetching } from "../../slices/auth";
import { errorHandler } from "../errorHandler";
type AnyAction = { type: string; [key: string]: any };

export function* logoutSagas() {
  try {
    yield put(requestAuth());

    yield logout();

    deleteCookie("intra_auth_user_id");
    deleteCookie("intra_auth_token");
    deleteCookie("intra_auth_name");
    deleteCookie("intra_auth_nik");
    deleteCookie("intra_auth_picture");
    deleteCookie("intra_auth_role");
    deleteCookie("intra_auth_is_app");
    deleteCookie("intra_auth_is_web");
    deleteCookie("intra_auth_departement_id");
    deleteCookie("intra_auth_expires_at");
    deleteCookie("intra_auth_menu_access");

    yield put(
      receiveAuth({
        name: "",
        nik: "",
        role: "",
        picture: "",
        menu_access: "",
      })
    );

    yield put(setTextNotification({ text: "Logout Successfull", severity: "success" }));
  } catch (error: any) {
    yield put(receiveAuth({ name: null }));
    errorHandler(error);

    yield put(setTextNotification({ text: error.message, severity: "error" }));
  }
  yield put(setAuthFetching(false));
}

export function* watchLogoutAsync() {
  yield takeEvery(LOGOUT, logoutSagas);
}
