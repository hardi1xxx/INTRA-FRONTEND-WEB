import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import { ReactNode, useState, createContext } from "react"

type AlertContextType = {
    show: (title: string, content?: string) => void
}

const AlertsContext = createContext<AlertContextType>({show: () => {}});

const AlertsProvider = ({ children } : {children: ReactNode}) => {
    const [open, setOpen] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string>()

    const close = () => {
        setOpen(false)
    }

    const show = (title: string, content?: string) => {
        setTitle(title)
        if(content){
            setContent(content)
        }

        setOpen(true)
    }

    return(
        <AlertsContext.Provider value={{show}}>
            <Dialog
                open={open}
                onClose={close}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" variant="h3" fontWeight={'bold'}>
                {title}
                </DialogTitle>
                {content && <DialogContent>
                    <DialogContentText id="alert-dialog-description" sx={{whiteSpace: "pre-line"}}>
                        {content}
                    </DialogContentText>
                </DialogContent>}
                <DialogActions>
                    <Button onClick={close}>Close</Button>
                </DialogActions>
            </Dialog>
            {children}
        </AlertsContext.Provider>
    )
}

export {AlertsContext}
export default AlertsProvider