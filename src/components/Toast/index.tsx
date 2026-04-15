'use client'

import { setTextNotification } from "@/lib/redux/slices/notification";
import { RootState } from "@/lib/redux/store";
import { deleteCookie } from "cookies-next";
import { ReactNode, createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

// Import toastify css file
import "react-toastify/dist/ReactToastify.css";

type ToastContextType = {
    show: (content: string, type: "error" | "info" | "success" | "warning") => boolean,
}

const ToastContext = createContext<ToastContextType>({ show: () => true })

const ToastProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter()
    const dispatch = useDispatch()
    const [open,setOpen] = useState(false)
    const { text, severity, responseCode } = useSelector((state: RootState) => state.notification)

    const show = (content: string, type: "error" | "info" | "success" | "warning") => {
        if (!open) {
            setOpen(true)
            if (type === 'success') {
                toast.success(content)
            } else if (type === 'error') {
                toast.error(content)
            } else if (type === 'warning') {
                toast.warning(content)
            } else {
                toast.info(content)
            }
            setTimeout(() => {
                setOpen(false)
            }, 1000)
        }
        return true
    }

    useEffect(() => {
        if (text && severity) {
            if (responseCode == 200) {
                show(text, severity)
            } else {
                show(text, severity)
                if (responseCode === 401) {
                    deleteCookie('token')
                    deleteCookie('name')
                    deleteCookie('nik')
                    deleteCookie('picture')
                    deleteCookie('role')
                    deleteCookie('expires_at')
                    deleteCookie('menu_access')
    
                    router.refresh()
                }
            }
            dispatch(setTextNotification({text: undefined,severity: undefined}))
        }
    }, [severity])

    return (
        <ToastContext.Provider value={{ show }}>
            <ToastContainer
                draggable={false}
                newestOnTop={false}
                autoClose={2000}
            />
            {children}
        </ToastContext.Provider>
    )
}

export { ToastContext }
export default ToastProvider