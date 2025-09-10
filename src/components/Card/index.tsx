'use client'

import { Card, CardContent, CardHeader, Divider, SxProps } from "@mui/material"
import { ReactNode } from "react"
import { Theme, useTheme } from '@mui/material/styles';
import theme from "../themes";

type MainCardType = {
    children: ReactNode
    border?: boolean
    boxShadow?: boolean
    content?: boolean
    shadow? : string
    contentClass? : string
    sx? : SxProps<Theme>
    headerSX? : SxProps<Theme>
    contentSX? : SxProps<Theme>
    title? : string
    secondary? : ReactNode
}

const MainCard = ({border, children,boxShadow,shadow,sx,title,headerSX,secondary,content,contentSX,contentClass}: MainCardType) => {
    const theme = useTheme<any>();

    return(
        <Card
            sx={{
                border: border ? '1px solid' : 'none',
                borderColor: 'rgb(227, 232, 239)',
                ':hover': {
                    boxShadow: boxShadow ? shadow || '0 2px 14px 0 rgb(32 40 45 / 8%)' : 'inherit'
                },
                ...sx
                }}
        >
             {/* card header and action */}
            {title && <CardHeader sx={{...headerSX,padding: '1rem'}} title={title} action={secondary} />}

            {/* content & header divider */}
            {title && <Divider />}

            {/* card content */}
            {content && (
                <CardContent sx={contentSX} className={contentClass}>
                    {children}
                </CardContent>
            )}
            {!content && children}
        </Card>
    )
}

export default MainCard
