import { setCookie } from "cookies-next";
import { login } from "../../../services";
import { LoginServiceResponse } from "../../../services/auth";
import { setTextNotification } from "../../slices/notification";
import { errorAuth, receiveAuth, requestAuth } from "../../slices/auth";
import { LOGIN } from "../../types";
import { put, takeEvery } from "redux-saga/effects";

type AnyAction = { type: string; [key: string]: any };

export function* loginSagas({ param }: AnyAction) {
  try {
    yield put(requestAuth());
    const loginResponse: LoginServiceResponse = yield login(param);
    if (!loginResponse.result.is_web) {
      yield put(errorAuth("Unauthorized!"));
      yield put(setTextNotification({ text: "Unauthorized!", severity: "error" }));
      return;
    }

    setCookie("intra_auth_user_id", loginResponse.result.id);
    setCookie("intra_auth_token", loginResponse.result.token);
    setCookie("intra_auth_name", loginResponse.result.name);
    setCookie("intra_auth_nik", loginResponse.result.nik);
    setCookie("intra_auth_picture", loginResponse.result.picture);
    setCookie("intra_auth_role", loginResponse.result.roles);
    setCookie("intra_auth_is_app", loginResponse.result.is_app);
    setCookie("intra_auth_is_web", loginResponse.result.is_web);
    setCookie("intra_auth_departement_id", loginResponse.result.departement_id);
    setCookie("intra_auth_expires_at", loginResponse.result.expires_at);
    setCookie(
      "intra_auth_menu_access",
      loginResponse.result.menu_access.filter((value) => value.show).map((value) => value.menu)
    );
    window.localStorage.setItem(
      "intra_auth_menu_access",
      JSON.stringify(loginResponse.result.menu_access.filter((value) => value.show).map((value) => value.menu))
    );
    window.localStorage.setItem(
      "intra_auth_menu_access_create",
      JSON.stringify(loginResponse.result.menu_access.filter((value) => value.create).map((value) => value.menu))
    );
    window.localStorage.setItem(
      "intra_auth_menu_access_edit",
      JSON.stringify(loginResponse.result.menu_access.filter((value) => value.edit).map((value) => value.menu))
    );
    window.localStorage.setItem(
      "intra_auth_menu_access_delete",
      JSON.stringify(loginResponse.result.menu_access.filter((value) => value.delete).map((value) => value.menu))
    );

    yield put(receiveAuth({ name: loginResponse.result.name, role: loginResponse.result.roles }));

    yield put(setTextNotification({ text: "Login Successfull", severity: "success" }));
    window.location.href = param.redirect || '/dashboard';
  } catch (error: any) {
    yield put(errorAuth(error.message));
    yield put(setTextNotification({ text: error.message, severity: "error" }));
  }
}

export function* watchLoginAsync() {
  yield takeEvery(LOGIN, loginSagas);
}
