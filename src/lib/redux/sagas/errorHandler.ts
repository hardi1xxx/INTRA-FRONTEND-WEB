import { AxiosError } from "axios";
import { deleteCookie } from "cookies-next";

export function errorHandler(error: any): {
  message: string;
  statusCode: number;
  errorValidations: { [key: string]: string }[];
} {
  let errorCause = error.cause,
    errorMessage = "";
  let statusCode = 500;
  let errorValidations: { [key: string]: string }[] = [];
  if (errorCause) {
    const errorResponse = errorCause.response,
      errorData = errorResponse.data;
    statusCode = errorResponse.status;
    if (statusCode === 422) {
      errorMessage = "";
      if (Array.isArray(errorData.message)) {
        for (const message of errorData.message) {
          for (const [key, value] of Object.entries(message)) {
            errorValidations.push({ [key]: value as string });
            errorMessage += value + "\n";
          }
        }
      } else if (typeof errorData.message === "string") {
        errorMessage = errorData.message;
      } else {
        for (const [key, message] of Object.entries(errorData.message)) {
          const messageArr = message as any[];
          errorValidations.push({ [key]: messageArr[0] as string });
          errorMessage += messageArr[0] + "\n";
        }
      }
    } else {
      errorMessage = errorData.message;
    }
  } else {
    errorMessage = error.message;
  }

  if (statusCode === 401) {
    deleteCookie("intra_auth_token");
    deleteCookie("intra_auth_name");
    deleteCookie("intra_auth_nik");
    deleteCookie("intra_auth_picture");
    deleteCookie("intra_auth_role");
    deleteCookie("intra_auth_expires_at");
    deleteCookie("intra_auth_menu_access");
    window.location.href = "/";
  }

  if (error instanceof AxiosError || error.response?.data?.message) {
    if (typeof error.response?.data?.message == "object") {
      if (Array.isArray(Object.values(error.response?.data?.message)[0])) {
        return {
          message: (Object.values(error.response?.data?.message)[0] as string[])[0] as string,
          statusCode: error.response.status,
          errorValidations,
        };
      }
      return {
        message: Object.values(error.response?.data?.message)[0] as string,
        statusCode: error.response.status,
        errorValidations,
      };
    }
    return {
      message: (error.response?.data?.message ?? error.message) as string,
      statusCode: error.response.status,
      errorValidations,
    };
  }
  if (errorCause instanceof AxiosError || errorCause?.response?.data?.message) {
    if (typeof errorCause.response?.data?.message == "object") {
      if (Array.isArray(Object.values(errorCause.response?.data?.message)[0])) {
        return {
          message: (Object.values(errorCause.response?.data?.message)[0] as string[])[0] as string,
          statusCode: errorCause.response.status,
          errorValidations,
        };
      }
      return {
        message: Object.values(errorCause.response?.data?.message)[0] as string,
        statusCode: errorCause.response.status,
        errorValidations,
      };
    }
    return {
      message: errorCause.response?.data?.message as string,
      statusCode: errorCause.response?.status,
      errorValidations,
    };
  }

  return {
    message: errorMessage,
    statusCode: statusCode,
    errorValidations,
  };
}
