'use client'

import { setTextNotification } from "@/lib/redux/slices/notification";
import { RootState } from "@/lib/redux/store";
import { Alert, Slide, Snackbar } from "@mui/material"
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { ReactNode, useState, createContext, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";

type SnackbarContextType = {
    show: (content: string, type: "error" | "info" | "success" | "warning", duration: number) => Promise<Boolean>
}

const SnackbarContext = createContext<SnackbarContextType>({show: () => new Promise(((resolve,reject) => resolve(true)))});

const SnackbarProvider = ({ children } : {children: ReactNode}) => {
    const router = useRouter()
    const dispatch = useDispatch()
    const [open,setOpen] = useState(false)
    const {text,severity,responseCode} = useSelector((state: RootState) => state.notification)
    const [content,setContent] = useState<string>('')
    const [autoHideDuration,setAutoHideDuration] = useState<number>(2000)
    const [type,setType] = useState<"error" | "info" | "success" | "warning" | undefined>()

    const show = (content: string, type: "error" | "info" | "success" | "warning", duration: number) => {
        setContent(content)
        setType(type)
        setOpen(true)
        setAutoHideDuration(duration)

        return new Promise<boolean>((resolve,reject) => setTimeout(() => {
            if(type == 'success'){
                resolve(true)
            }else{
                resolve(false)
            }
        },duration))
    }

    useEffect(() => {
        if(text && severity){
            if(responseCode == 200){
                show(text,severity,2000)
            }else{
                show(text,severity,2000).then((res) => {
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
                })
            }
        }
    },[severity])

    useEffect(() => {
        if(!open){
            if(text && severity){
                dispatch(setTextNotification({text: undefined,severity: undefined}))
            }
        }
    },[open])

    return(
        <SnackbarContext.Provider value={{show}}>
            <Snackbar
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                TransitionComponent={Slide}
                open={open}
                onClose={() => {
                    setOpen(false)
                }}
                autoHideDuration={autoHideDuration}
            >
                <Alert severity={type} sx={{ width: '100%' }}>
                    {content}
                </Alert>
            </Snackbar>
            {children}
        </SnackbarContext.Provider>
    )
}

export {SnackbarContext}
export default SnackbarProvider