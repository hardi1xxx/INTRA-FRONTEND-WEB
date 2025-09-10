/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import {  Avatar, Box, Card, CardContent, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Skeleton} from "@mui/material"
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import Link from "next/link";
import { getCookie } from "cookies-next";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "@/lib/redux/store";
import { usePathname, useRouter } from "next/navigation";
import ModalProfilePicture from "./modalProfilePicture";
import { useSnackbar } from "@/components/hooks";

const UserMenu = () => {
  const router = useRouter()
  const snackbar = useSnackbar()
  const pathname = usePathname()

  const [openEditProfile, setOpenEditProfile] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [profilePicture, setProfilePicture] = useState('')
  const [nik, setNik] = useState('')
  const {auth: {picture}} = useSelector((state:RootState) => state.auth)
  const {severity,text} = useSelector((state:RootState) => state.notification)

  // init data on page load
  useEffect(() => {
    setName(getCookie('intra_auth_name') ?? '')
    setRole(getCookie('intra_auth_role') ?? '')
    setProfilePicture(getCookie('intra_auth_picture') ?? '')
    setNik(getCookie('intra_auth_nik') ?? '')
  },[])


  useEffect(() => {
    if(picture != ''){
      setProfilePicture(getCookie('intra_auth_picture') ?? '')
    }

    if(picture == ''){
      const showSnackbar = async () => {
        if(text && severity){
          const res = await snackbar.show(text,severity,500)

          if(res){
              router.push('/login')
          }
        }
      }

      showSnackbar()
    }
  },[picture,text,severity])

  return(
    <>
      <Box padding={'0px 16px 16px 16px'}>
        <Card sx={{
          color: 'rgb(54, 65, 82)',
          transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          boxShadow: 'none',
          borderRadius: '8px',
          background: '#2d50b0',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <CardContent sx={{
            padding: '16px',
            paddingBottom: '16px !important'
          }}>
            <Box sx={{
              position: 'absolute',
              width: '157px',
              height: '157px',
              background: '#223c85 !important',
              borderRadius: '50%',
              top: '-105px',
              right: '-96px',
            }}/>
            <List sx={{
              paddingTop: '0px'
            }}>
              <ListItem
                disablePadding
              >
                <ListItemAvatar>
                  <Avatar
                    onClick={() => setOpenEditProfile(true)}
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
                      borderRadius: '22px',
                      width: '44px',
                      height: '44px',
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
                      <EditIcon />
                    </Box>
                    {
                      profilePicture != '/storage/' ?
                      <img src={`${(process.env.NEXT_PUBLIC_TARGET_API)?.replace('/api','')}${profilePicture}`} alt="profile-picture" style={{
                        objectFit: 'cover',
                        objectPosition: 'bottom',
                        width: '100%',
                      }}/>
                      :
                      <PersonIcon />
                    }
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={name ?? <Skeleton variant="text" sx={{ fontSize: '1rem' }} />} secondary={role ?? <Skeleton variant="text" sx={{ fontSize: '1rem' }} />} primaryTypographyProps={{sx: {color: 'white !important'}}} secondaryTypographyProps={{sx: {color: 'white !important'}}}/>
              </ListItem>
            </List>
            <Box>
              <Link
                href={'/profile'}
                style={{
                  width: '100%',
                  textDecoration: 'none',
                  color: pathname == '/profile' ? '#50623A' : 'inherit',
                  fontWeight: pathname == '/profile' ? 'bold' : 'normal',
                  fontFamily: 'Roboto,sans-serif',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgb(255, 255, 255)',
                  padding: '10px 0',
                  borderRadius: '8px'
                }}
              >
                <SettingsIcon sx={{
                  width: '44px',
                  marginRight: '12px'
                }}/>
                Profile
              </Link>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <ModalProfilePicture open={openEditProfile} setOpen={setOpenEditProfile} />
    </>
  )
}

export const UserMenuMini = () => {
  const router = useRouter()
  const snackbar = useSnackbar()

  const [openEditProfile, setOpenEditProfile] = useState(false)
  const [profilePicture, setProfilePicture] = useState('')
  const {auth: {picture}} = useSelector((state:RootState) => state.auth)
  const {severity,text} = useSelector((state:RootState) => state.notification)

  useEffect(() => {
    setProfilePicture(getCookie('intra_auth_picture') ?? '')
  },[])

  useEffect(() => {
    if(picture != ''){
      setProfilePicture(getCookie('intra_auth_picture') ?? '')
    }

    if(picture == ''){
      const showSnackbar = async () => {
        if(text && severity){
          const res = await snackbar.show(text,severity,500)

          if(res){
              router.push('/login')
          }
        }
      }

      showSnackbar()
    }
  },[picture,text,severity])

  return(
    <>
      <ListItem
        disablePadding
      >
        <ListItemAvatar>
          <Avatar
            onClick={() => setOpenEditProfile(true)}
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
              borderRadius: '22px',
              width: '44px',
              height: '44px',
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
              <EditIcon />
            </Box>
            {
              profilePicture != '/storage/' ?
              <img src={`${(process.env.NEXT_PUBLIC_TARGET_API)?.replace('/api','')}${profilePicture}`} alt="profile-picture" style={{
                objectFit: 'cover',
                objectPosition: 'bottom',
                width: '100%',
              }}/>
              :
              <PersonIcon />
            }
          </Avatar>
        </ListItemAvatar>
      </ListItem>
      <Link href={'/profile'} passHref style={{ textDecoration: 'none', color: 'inherit'}}>
          <ListItemButton sx={{padding: '0px'}}>
              <ListItemIcon sx={{height: '46px', width: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <SettingsIcon />
              </ListItemIcon>
          </ListItemButton>
      </Link>
      <ModalProfilePicture open={openEditProfile} setOpen={setOpenEditProfile} />
    </>
  )
}

export default UserMenu