import { SetStateAction, useContext, useEffect, useState } from "react";
import { AlertsContext } from "./AlertContext";
import { SnackbarContext } from "./SnackbarContext";
import EscPosEncoder from "@waymen/esc-pos-encoder";
import { dateTimeFormat, sleep } from "./helper";

export const useAlerts = () => {
    const { show } = useContext(AlertsContext);
    
    const showAlert = (title: string, content?: string) => {
      show(title,content);
    }
  
    
    return { show: showAlert };
}


export const useSnackbar = () => {
  const { show } = useContext(SnackbarContext);
    
  const showSnackbar = async (title: string, type: "error" | "info" | "success" | "warning", duration: number = 2000) => {
    return await show(title,type,duration);
  }

  
  return { show: showSnackbar };
}

