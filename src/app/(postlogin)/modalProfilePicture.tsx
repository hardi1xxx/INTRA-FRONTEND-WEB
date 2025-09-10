/* eslint-disable @next/next/no-img-element */
import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material"
import { ChangeEvent, SetStateAction, useState } from "react"
import PersonIcon from '@mui/icons-material/Person';
import { useDispatch, useSelector } from "react-redux";
import { CHANGE_PROFILE_PICTURE } from "@/lib/redux/types";
import { RootState } from "@/lib/redux/store";
import { fileToBase64 } from "@/components/helper";
import { Dialogs } from "@/components/dialog";

type ModalProfilePictureType = {
    open: boolean,
    setOpen: React.Dispatch<SetStateAction<boolean>>
}


const ModalProfilePicture = ({ open, setOpen }: ModalProfilePictureType) => {
    const { fetching, auth: { picture } } = useSelector((state: RootState) => state.auth)
    const dispatch = useDispatch()
    const [fileValue, setFileValue] = useState<string>()
    const [file, setFile] = useState<File | null>()

    // event when file value changed
    const onFileUploadChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFile(event.target.files ? event.target.files[0] : null)
        setFileValue(event.target.value)
    }

    // process cancel button
    const onCancel = () => {
        setFile(null)
        setFileValue(undefined)
        setOpen(false)
    }

    // submit data
    const onSubmit = async () => {
        if (file) {
            const base64File = await fileToBase64(file)
            dispatch({ type: CHANGE_PROFILE_PICTURE, picture: base64File, fileName: fileValue })
            onCancel()
        }
    }

    return (
        <Dialogs
            open={open}
            setOpen={setOpen}
            title="Change Profile Picture"
        >
            <Box
                // sx={{minWidth: {sm: '660px', xs: 'auto'}}}
                width={'100%'}
                display={'flex'}
                flexDirection={'column'}
                gap={'1rem'}
                alignItems={'center'}
            >
                <Box
                    display={'flex'}
                    gap={'1rem'}
                    justifyContent={'space-between'}
                    alignItems={'stretch'}
                    width={'100%'}
                    sx={{
                        flexDirection: { sm: 'row', xs: 'column' }
                    }}
                >
                    <TextField
                        type="file"
                        onChange={onFileUploadChange}
                        size="small"
                        sx={{ flexGrow: '1' }}
                        inputProps={{
                            accept: 'image/*'
                        }}
                    />
                </Box>
                <Typography>{file ? 'New' : 'Current'} Profile Picture</Typography>
                <Box>
                    {
                        file || (picture != '/storage/') ?
                            <img
                                src={file ? URL.createObjectURL(file ?? new Blob) : ((process.env.NEXT_PUBLIC_TARGET_API)?.replace('/api', '') + (picture ?? ''))}
                                style={{
                                    objectFit: 'cover',
                                    objectPosition: 'bottom',
                                    maxWidth: '100%',
                                    maxHeight: 'calc(100vh - 500px)'
                                }}
                                alt="Profil Picture"
                            /> :
                            <Box sx={{ width: 300, height: 400, border: '1px solid black' }} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                                <PersonIcon sx={{ fontSize: '10rem' }} />
                            </Box>
                    }
                </Box>
                <Box display={'flex'} flexDirection={'row-reverse'} justifyContent={'end'} width={'100%'} marginTop={'1rem'} gap={'1rem'}>
                    <Button color="primary" variant='contained' size="small" type="button" onClick={onSubmit} disabled={fetching} endIcon={fetching && <CircularProgress color='inherit' size={'1rem'} />}>
                        Submit
                    </Button>
                    <Button color="error" variant='contained' size="small" type="button" onClick={onCancel}>
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Dialogs>
    )
}

export default ModalProfilePicture