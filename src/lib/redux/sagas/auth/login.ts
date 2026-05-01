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
    const data = loginResponse.data;

    console.log(data);

    // 🚨 WARNING: access_token boolean itu aneh
    setCookie("intra_auth_user_id", data.user.id);
    setCookie("intra_auth_token", data.access_token); 
    setCookie("intra_auth_name", data.user.name);
    setCookie("intra_auth_nik", data.user.nik);
    setCookie("intra_auth_role", data.role);
    setCookie("intra_auth_expires_in", data.expires_in);

    // menu access sekarang simple array
    setCookie("intra_auth_menu_access", data.menu_access);

    window.localStorage.setItem(
      "intra_auth_menu_access",
      JSON.stringify(data.menu_access)
    );

    // ❌ REMOVE ini semua karena sudah tidak ada di backend
    // create/edit/delete access sudah hilang
    // kalau kamu tetap pakai, itu fake security

    yield put(
      receiveAuth({
        name: data.user.name,
        role: data.role,
      })
    );

    yield put(
      setTextNotification({
        text: "Login Successful",
        severity: "success",
      })
    );

    window.location.href = param.redirect || "/dashboard";
  } catch (error: any) {
    yield put(errorAuth(error.message));
    yield put(
      setTextNotification({
        text: error.message,
        severity: "error",
      })
    );
  }
}

export function* watchLoginAsync() {
  yield takeEvery(LOGIN, loginSagas);
}
