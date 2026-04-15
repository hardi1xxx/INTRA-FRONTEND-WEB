'use client'

import { Box, Breadcrumbs, Typography } from "@mui/material"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Home from '@mui/icons-material/Home';
import { titleCase } from "../helper";

type MainPageType = {
    children: ReactNode,
    title? : string
}

const MainPage = ({title, children}: MainPageType) => {
    const pathname = usePathname()
    return(
        <>
            <Box 
                border={'4px'}
                sx={{
                    backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: {sm: 'row', xs: 'column-reverse'},
                    gap: '1rem',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    borderRadius: '8px',
                    bgcolor: '#825f4f'
                }}
            >
                <Typography variant="h3" fontWeight={500} color={'white'}>{title}</Typography>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" sx={{color: "white"}} />} >
                    {
                        pathname.split('/').map((value,index) => {
                            return(
                                <Typography key={value} color="white" sx={{ display: 'flex', alignItems: 'center' }}>{value == '' ? <Home fontSize="small"/> : titleCase(value)}</Typography>
                            )
                        })
                    }
                </Breadcrumbs>
            </Box>
            {
                children
            }
        </>
    )
}

export default MainPage