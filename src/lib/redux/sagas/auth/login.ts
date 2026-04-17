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
    console.log(loginResponse)

    setCookie("intra_auth_user_id", loginResponse.data.user.id);
    setCookie("intra_auth_token", loginResponse.data.access_token);
    setCookie("intra_auth_name", loginResponse.data.user.name);
    setCookie("intra_auth_nik", loginResponse.data.user.nik);
    setCookie("intra_auth_picture", loginResponse.data.user.picture);
    setCookie("intra_auth_role", loginResponse.data.roles);
    setCookie("intra_auth_expires_at", loginResponse.data.expires_at);
    setCookie(
      "intra_auth_menu_access",
      loginResponse.data.menu_access.filter((value) => value.show).map((value) => value.menu)
    );
    window.localStorage.setItem(
      "intra_auth_menu_access",
      JSON.stringify(loginResponse.data.menu_access.filter((value) => value.show).map((value) => value.menu))
    );
    window.localStorage.setItem(
      "intra_auth_menu_access_create",
      JSON.stringify(loginResponse.data.menu_access.filter((value) => value.create).map((value) => value.menu))
    );
    window.localStorage.setItem(
      "intra_auth_menu_access_edit",
      JSON.stringify(loginResponse.data.menu_access.filter((value) => value.edit).map((value) => value.menu))
    );
    window.localStorage.setItem(
      "intra_auth_menu_access_delete",
      JSON.stringify(loginResponse.data.menu_access.filter((value) => value.delete).map((value) => value.menu))
    );

    yield put(receiveAuth({ name: loginResponse.data.user.name, role: loginResponse.data.roles }));

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
