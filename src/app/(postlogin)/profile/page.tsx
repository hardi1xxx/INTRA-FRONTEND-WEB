/* eslint-disable @next/next/no-img-element */
'use client'

import MainPage from "@/components/MainPage"
import { RootState } from "@/lib/redux/store"
import { Avatar, Box, Button } from "@mui/material"
import { useSelector } from "react-redux"
import EditIcon from '@mui/icons-material/Edit';
import FormBuilder from "@/components/FormBuilder"
import { IFormLayout } from "@/components/FormBuilder/interfaces"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import ModalChangePassword from "./modalChangePassword"
import ModalMenuAccess from "./modalMenuAccess"
import ModalProfilePicture from "../modalProfilePicture"

const ProfilePage = () => {
    const [profilePicture, setProfilePicture] = useState<string>()
    const { auth } = useSelector((state: RootState) => state.auth)
    const [openModalChangePassword, setOpenModalChangePassword] = useState<boolean>(false)
    const [openModalMenuAccess, setOpenModalMenuAccess] = useState<boolean>(false)
    const [openModalProfilePicture, setOpenModalProfilePicture] = useState<boolean>(false)
    const {
        control,
        formState: {
            errors
        },
        reset
    } = useForm({})

    // fill value to form
    useEffect(() => {
        reset(auth)
        setProfilePicture(auth.picture == '/storage/' ? '/images/person.png' : (process.env.NEXT_PUBLIC_TARGET_API)?.replace('/api', '') + (auth.picture ?? ''))
    }, [auth, reset])

    // column configuration for form editor
    const formLayout: IFormLayout[] = [
        {
            width: 12,
            title: 'User',
            fields: [
                {
                    fieldName: 'name',
                    label: 'Name',
                    disabled: true
                },
                {
                    fieldName: 'nik',
                    label: 'Nik',
                    disabled: true
                },
                {
                    fieldName: 'role',
                    label: 'Role',
                    disabled: true
                },
            ]
        }
    ]

    return (
        <>
            <MainPage
                title="Profile"
            >
                <Box
                    sx={{
                        backgroundColor: 'white',
                        display: 'flex',
                        flexDirection: { sm: 'row', xs: 'column' },
                        width: 'calc(100% - 40px)',
                        height: 'calc(100vh - 266px)',
                        alignItems: 'stretch',
                        padding: '20px',
                        borderRadius: '8px',
                        gap: '1rem',
                        flexGrow: 1
                    }}
                >
                    <Box
                        sx={{
                            // width: {sm: '50%',xs : '100%'},
                            // height: {sm: '100%', xs: 'calc(100vh - 610px)'},
                            aspectRatio: '1 / 1',
                        }}
                    >
                        {/* profile picture */}
                        <Avatar
                            // open modal change profile picture
                            onClick={() => setOpenModalProfilePicture(true)}
                            sx={{
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: '0',
                                fontFamily: 'Roboto, sans-serif',
                                lineHeight: '1',
                                overflow: 'hidden',
                                userSelect: 'none',
                                cursor: 'pointer',
                                borderRadius: '50%',
                                width: '100%',
                                height: '100%',
                                fontSize: '1.5rem',
                                color: '#50623A',
                                border: 'none rgb(33, 150, 243)',
                                background: 'rgb(255, 255, 255)',
                                marginRight: '12px',
                                '&:hover .edit-icon-hover': {
                                    display: 'flex',
                                }
                            }}
                        >
                            <Box
                                className="edit-icon-hover"
                                sx={{
                                    height: '100%',
                                    width: '100%',
                                    display: 'none',
                                    position: 'absolute',
                                    color: 'white',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'rgba(0, 0, 0, 0.4)'
                                }}>
                                <EditIcon sx={{ fontSize: { sm: '5rem', xs: 'auto' } }} />
                            </Box>
                            <img
                                src={profilePicture}
                                style={{
                                    objectFit: 'contain',
                                    objectPosition: 'bottom',
                                    maxHeight: '100%',
                                    maxWidth: '100%'
                                }}
                                alt="Profil Picture"
                            />
                        </Avatar>
                    </Box>
                    <Box
                        sx={{
                            width: { sm: '50%', xs: '100%' },
                            height: { sm: '100%', xs: '100%' },
                            flexGrow: 1
                        }}
                    >
                        <FormBuilder
                            formLayout={formLayout}
                            control={control}
                            errors={errors}
                            withCard={false}
                        />
                        <Box display={'flex'} flexDirection={'column'} alignItems={'stretch'} width={'100%'} marginTop={'1rem'} gap={'1rem'}>
                            {/* open modal menu access */}
                            <Button color="primary" variant='contained' size="small" type="button" onClick={() => { setOpenModalMenuAccess(true) }}>
                                Menu Access
                            </Button>
                            {/* open modal change password */}
                            <Button color="primary" variant='contained' size="small" type="button" onClick={() => setOpenModalChangePassword(true)}>
                                Change Password
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </MainPage>
            <ModalChangePassword open={openModalChangePassword} setOpen={setOpenModalChangePassword} />
            <ModalMenuAccess open={openModalMenuAccess} setOpen={setOpenModalMenuAccess} />
            <ModalProfilePicture open={openModalProfilePicture} setOpen={setOpenModalProfilePicture} />
        </>
    )
}

export default ProfilePage