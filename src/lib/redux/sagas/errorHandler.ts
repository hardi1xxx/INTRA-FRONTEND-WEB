import { deleteCookie } from "cookies-next";

export function errorHandler(error: any): { message: string, statusCode: number } {
  let errorCause = error.cause, errorMessage = ''
  let statusCode = 500
  if (errorCause) {
    const errorResponse = errorCause.response, errorData = errorResponse.data
    statusCode = errorResponse.status
    if (statusCode === 422) {
      errorMessage = "";
      if (Array.isArray(errorData.message)) {
        for (const message of errorData.message) {
          for (const [_, value] of Object.entries(message)) {
            errorMessage += value + "\n";
          }
        }
      } else if (typeof errorData.message == 'string') {
        errorMessage = errorData.message
      } else {
        for (const [_, message] of Object.entries(errorData.message)) {
          const messageArr = message as any[]
          errorMessage += messageArr[0] + "\n"
        }
      }
    } else {
      errorMessage = errorData.message;
    }
  } else {
    errorMessage = error.message
  }

  if (statusCode === 401) {
    deleteCookie('intra_auth_token')
    deleteCookie('intra_auth_name')
    deleteCookie('intra_auth_nik')
    deleteCookie('intra_auth_picture')
    deleteCookie('intra_auth_role')
    deleteCookie('intra_auth_expires_in')
    deleteCookie('intra_auth_menu_access')

    window.location.href = '/'
  }

  return {
    message: errorMessage,
    statusCode: statusCode
  }
}