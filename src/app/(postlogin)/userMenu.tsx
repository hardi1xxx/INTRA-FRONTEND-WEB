'use client'
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, Box, Typography } from "@mui/material"
import { getCookie } from "cookies-next";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "@/lib/redux/store";
import { useRouter } from "next/navigation";
import ModalProfilePicture from "./modalProfilePicture";
import { useSnackbar } from "@/components/hooks";
import { getShortName } from "@/components/helper";

const buildProfilePictureSrc = (picturePath: string, cacheVersion: number) => {
  if (!picturePath || picturePath === "/storage/") return "";

  if (picturePath.startsWith("http")) {
    return `${picturePath}?t=${cacheVersion}`;
  }

  const baseStorageUrl = process.env.NEXT_PUBLIC_TARGET_API?.replace("/api", "/storage") ?? "";
  const trimmedPath = picturePath.replace(/^\/+/, "");
  const normalizedPath = trimmedPath.startsWith("storage/") ? trimmedPath : `storage/${trimmedPath}`;

  return `${baseStorageUrl.replace(/\/+$/, "")}/${normalizedPath.replace(/^storage\//, "")}?t=${cacheVersion}`;
};

const UserMenu = () => {
  const router = useRouter()
  const snackbar = useSnackbar()

  const [openEditProfile, setOpenEditProfile] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [profilePicture, setProfilePicture] = useState('')
  const [avatarCacheVersion, setAvatarCacheVersion] = useState<number>(Date.now())
  const [nik, setNik] = useState('')
  const { auth: { picture }, auth } = useSelector((state: RootState) => state.auth)
  const { severity, text } = useSelector((state: RootState) => state.notification)
  const [currentPath, setCurrentPath] = useState("");


  // init data on page load
  useEffect(() => {
    initData()
  }, [])

  useEffect(() => {
    const onAuthUserUpdated = async () => {
      await initData();
      setAvatarCacheVersion(Date.now());
    };

    window.addEventListener("intra:auth-user-updated", onAuthUserUpdated);
    return () => {
      window.removeEventListener("intra:auth-user-updated", onAuthUserUpdated);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);
  
  const initData = async () => {
    setName(await getCookie('intra_auth_name') ?? '')
    setRole(await getCookie('intra_auth_role') ?? '')
    setProfilePicture(await getCookie('intra_auth_picture') ?? '')
    setNik(await getCookie('intra_auth_nik') ?? '')
  }

  useEffect(() => {
    if (picture != '') {
      const fetchProfilePicture = async () => {
        setProfilePicture(await getCookie('intra_auth_picture') ?? '')
        setAvatarCacheVersion(Date.now())
      }
      fetchProfilePicture()
    }

    if (picture == '') {
      const showSnackbar = async () => {
        if (text && severity) {
          const res = await snackbar.show(text, severity, 500)

          if (res) {
            // router.push('/login')
          }
        }
      }

      showSnackbar()
    }
  }, [picture, text, severity])

  useEffect(() => {
    setName(auth.name ?? name)
  }, [auth])

  return (
    <>
      <Box sx={{
        borderTop: 'none !important',
        padding: '4px'
      }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => {
              router.push('/profile')
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                cursor: 'pointer',

                border: '2px solid #30318B',
                borderRadius: '12px',
                padding: '8px 10px',
                width: '100%',
                transition: '0.2s',

                '&:hover': {
                  backgroundColor: '#30318B',
                  boxShadow: '0 0 12px rgba(124, 58, 237, 0.5)',
                  '& *': { color: 'white !important' },
                },
                ...(currentPath.includes('/profile') && {
                  backgroundColor: '#30318B',
                  '& *': { color: 'white !important' },
                }),

              }}

              onClick={() => router.push('/profile')}
            >

              <Avatar
                sx={{
                  width: '35px',
                  height: '35px',
                  borderRadius: '100%',
                  marginRight: '25px',
                  overflow: 'hidden',
                  border: '2px solid #30318B',
                }}
              >
                {
                  profilePicture != '/storage/' ?
                    <img
                      src={buildProfilePictureSrc(profilePicture, avatarCacheVersion)}
                      alt="profile-picture"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/images/person.png";
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '50%',
                      }}
                    />
                    :
                    <Box
                      sx={{
                        width: '44px',
                        height: '44px',
                        background: '#F59E0B',
                        borderRadius: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '18px',
                        color: 'white'
                      }}
                    >
                      {getShortName(name ?? '')}
                    </Box>
                }
              </Avatar>

              <Box>
             <Typography fontSize={14} fontWeight={600} lineHeight="18px">
  {name}
</Typography>
<Typography fontSize={12} lineHeight="14px">
  {role}
</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <ModalProfilePicture open={openEditProfile} setOpen={setOpenEditProfile} />
    </>
  )
}

export const UserMenuMini = () => {
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
  const router = useRouter()
  const snackbar = useSnackbar()

  const [openEditProfile, setOpenEditProfile] = useState(false)
  const [profilePicture, setProfilePicture] = useState('')
  const [avatarCacheVersion, setAvatarCacheVersion] = useState<number>(Date.now())
  const [name, setName] = useState('')
  const { auth: { picture }, auth } = useSelector((state: RootState) => state.auth)
  const { severity, text } = useSelector((state: RootState) => state.notification)

  useEffect(() => {
    const fetchProfilePicture = async () => {
      setProfilePicture(await getCookie('intra_auth_picture') ?? '')
      setAvatarCacheVersion(Date.now())
    }
    fetchProfilePicture()
    initData()
  }, [])

  useEffect(() => {
    const onAuthUserUpdated = async () => {
      setProfilePicture(await getCookie('intra_auth_picture') ?? '');
      setName(await getCookie('intra_auth_name') ?? '');
      setAvatarCacheVersion(Date.now());
    };

    window.addEventListener("intra:auth-user-updated", onAuthUserUpdated);
    return () => {
      window.removeEventListener("intra:auth-user-updated", onAuthUserUpdated);
    };
  }, []);

  const initData = async () => {
    setName(await getCookie('intra_auth_name') ?? '')
  }

  useEffect(() => {
    if (picture != '') {
      const fetchProfilePicture = async () => {
        setProfilePicture(await getCookie('intra_auth_picture') ?? '')
        setAvatarCacheVersion(Date.now())
      }
      fetchProfilePicture()
    }

    if (picture == '') {
      const showSnackbar = async () => {
        if (text && severity) {
          const res = await snackbar.show(text, severity, 500)

          if (res) {
            // router.push('/login')
          }
        }
      }

      showSnackbar()
    }
  }, [picture, text, severity])

  useEffect(() => {
    setName(auth.name ?? name)
  }, [auth])

  return (
    <>
      <Box>
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      flexDirection: 'column',
      gap: '12px',
      border: '2px solid #30318B',
      borderRadius: '12px',
      padding: '5px',
      transition: '0.2s',

      // Hover
      '&:hover': {
        backgroundColor: '#30318B',
        '& *': { color: 'white !important' },
      },

      // Active / current page
      ...(currentPath.includes('/profile') && {
        backgroundColor: '#30318B',
        '& *': { color: 'white !important' },
      }),
    }}
  >
    <Avatar
      onClick={() => router.push('/profile')}
      sx={{
        width: 34,
        height: 34,
        cursor: 'pointer',
        bgcolor: '#fff',
        outline: 'none',

        '&:focus, &:focus-visible': {
          outline: 'none',
          boxShadow: 'none',
        },
      }}
    >
      {profilePicture !== '/storage/' ? (
        <img
          src={buildProfilePictureSrc(profilePicture, avatarCacheVersion)}
          alt="profile-picture"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/images/person.png";
          }}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            borderRadius: '100%',
          }}
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            backgroundColor: '#F59E0B',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 600,
            color: 'white',
          }}
        >
          {getShortName(name ?? '')}
        </Box>
      )}
    </Avatar>
  </Box>
</Box>

      <ModalProfilePicture open={openEditProfile} setOpen={setOpenEditProfile} />
    </>
  )
}

export default UserMenu