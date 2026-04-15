import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Accordion, AccordionDetails, AccordionSummary, Box, CircularProgress, ClickAwayListener, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip, TooltipProps, Typography, styled, tooltipClasses } from '@mui/material';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MenuListType, menuList } from './menuList';
import Link from 'next/link';
import { getCookie } from 'cookies-next';
import { DataMenuAccessRequestType } from '@/lib/services/master/menuAccess';
import { getMenuAccess } from '@/lib/services';
import { MenuAccessResponse } from '@/lib/services/auth';

// tooltip component
const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 11,
      borderRadius: '16px'
    },
  }));

const CustomDrawer = ({isCollapsed} : {isCollapsed : boolean}) => {
    const [menuAccess, setMenuAccess] = useState<string[]>([])
    const pathname = usePathname()
    const [selectedUrl, setSelectedUrl] = useState<string>()
    const [expanded, setExpanded] = useState<{[key: string] : boolean}>({});

    const [openedTooltip, setOpenedTooltip] = useState<string>();

    // event when dropdown menu clicked
    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        
        if(isExpanded){
            setExpanded({...expanded, [panel] : true});
        }else{
            const newExpanded = {...expanded}
            delete newExpanded[panel]
            setExpanded(newExpanded)
        }
    };

    // close other opened menu when click new menu
    useEffect(() => {
        const newExpanded : {[key: string]:boolean} = {}
        for (const [key, value] of Object.entries(expanded)) {
            newExpanded[key] = selectedUrl?.includes(key) || false
        }
        setExpanded(newExpanded)
    },[selectedUrl])

    // init expanded menu when page loaded
    useEffect(() => {
        let pathnameBreakdowns = pathname.split('/')
        pathnameBreakdowns = pathnameBreakdowns.filter((value,index) => value != '')

        let paths = ''
        let expandedInsert : {[key: string] : boolean} = {}
        for(const path of pathnameBreakdowns){
            paths += path
            expandedInsert[paths] = true
            paths += '/'
        }
        setExpanded(expandedInsert)

        setMenuAccess(JSON.parse(getCookie('intra_auth_menu_access') || '[]'))

        setSelectedUrl(pathname)
    },[])

    // generate drawer menu element
    const generateDrawer = (menus : MenuListType[]) => (
        menus.map((value) => {
            const Icon = value.icon
            if(!value.child){
                if(menuAccess.find((valueMenuAccess : string) => valueMenuAccess == value.id)){
                    return(
                        <List key={value.id} component="nav" id={value.id} disablePadding>
                            <Link href={value.url ?? ""} passHref style={{width: '100%', textDecoration: 'none', color: 'inherit'}} onClick={() => {
                                    setSelectedUrl(value.url)
                                }}>
                                <ListItemButton selected={selectedUrl == value.url}>
                                    {
                                        Icon ? 
                                        <ListItemIcon>
                                            {Icon}
                                        </ListItemIcon> : 
                                        <ListItemIcon sx={{ my: 'auto', minWidth: 18}}> 
                                            <FiberManualRecordIcon 
                                                sx={{
                                                    width: expanded[value.id] ? 8 : 6,
                                                    height: expanded[value.id] ? 8 : 6,
                                                    minWidth: '18px'
                                                }}
                                                fontSize={'medium'}
                                            /> 
                                        </ListItemIcon>
                                    }
                                    <ListItemText>{value.text}</ListItemText>      
                                </ListItemButton>
                            </Link>
                        </List>
                    )
                }
            }

            if(menuAccess.some((valueMenuAccess : string) => valueMenuAccess.includes(value.id))){
                return(
                <Accordion 
                key={value.id} 
                id={value.id} 
                disableGutters 
                sx={{boxShadow: 'none'}} 
                expanded={expanded[value.id] || false}
                onChange={handleChange(value.id)}
                className='accordion-custom'
                >
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{color : expanded[value.id] ? 'white' : undefined}} />}
                    aria-controls={`${value.id}-content`}
                    className={expanded[value.id] ? 'selected-accordion' : ''}
                    id={`${value.id}-header`}
                    >
                        {
                            Icon && <ListItemIcon sx={{color : expanded[value.id] ? 'white' : undefined}}>
                                {Icon}
                            </ListItemIcon>
                        }
                    <Typography fontWeight={expanded[value.id] ? '600' : '400'}>{value.text}</Typography>
                    </AccordionSummary>
                    <AccordionDetails style={{paddingRight: (value.child || []).some(value => value.child) ? 0 : undefined}}>
                        {
                            generateDrawer(value.child || [])
                        }
                    </AccordionDetails>
                </Accordion>
                )
            }else{
                return null
            }

        })
    )

    // generate mini drawer menu element
    const generateMiniDrawer = (menus : MenuListType[]) => (
        menus.map((value) => {
            const Icon = value.icon

            if(menuAccess.some((valueMenuAccess : string) => valueMenuAccess.includes(value.id))){
                return <List key={value.id} component="nav" id={value.id} disablePadding>
                    {
                        !value.child && <Link href={value.url ?? ""} passHref style={{ textDecoration: 'none', color: 'inherit'}} onClick={() => {
                                setSelectedUrl(value.url)
                            }}>
                            <ListItemButton selected={(value.url || '').includes(selectedUrl || '')} sx={{padding: '0px'}}>
                                <ListItemIcon sx={{height: '46px', width: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    {Icon}
                                </ListItemIcon>
                            </ListItemButton>
                        </Link>
                    }
                    {
                        value.child && <>
                                <LightTooltip 
                                    placement='right-start' 
                                    open={value.id == openedTooltip} 
                                    onClose={(event) => { 
                                        setOpenedTooltip(undefined)
                                    }}
                                    onOpen={() => setOpenedTooltip(value.id)}
                                    title={
                                    <List>
                                        {
                                            value.child.map((valueChild) => {
                                                if(valueChild.child){
                                                    return(
                                                        <LightTooltip key={valueChild.id} placement='right-start' title={
                                                            <List>
                                                                {
                                                                    valueChild.child.map(valueGrandChild => (
                                                                        <Link key={valueGrandChild.id} href={valueGrandChild.url ?? ""} passHref style={{width: '100%', textDecoration: 'none', color: 'inherit'}} onClick={() => {
                                                                            setSelectedUrl(valueGrandChild.url)
                                                                        }}>
                                                                            <ListItemButton>
                                                                                <ListItemIcon sx={{ my: 'auto', minWidth: 18}}> 
                                                                                    <FiberManualRecordIcon 
                                                                                        sx={{
                                                                                            width: expanded[value.id] ? 8 : 6,
                                                                                            height: expanded[value.id] ? 8 : 6,
                                                                                            minWidth: '18px'
                                                                                        }}
                                                                                        fontSize={'medium'}
                                                                                    /> 
                                                                                </ListItemIcon>
                                                                                <ListItemText>{valueGrandChild.text}</ListItemText>   
                                                                            </ListItemButton>
                                                                        </Link>
                                                                    ))
                                                                }
                                                            </List>
                                                        }>
                                                            <ListItem 
                                                                secondaryAction={
                                                                    <ChevronRightIcon />
                                                                }
                                                            >
                                                                <ListItemIcon sx={{ my: 'auto', minWidth: 18}}> 
                                                                    <FiberManualRecordIcon 
                                                                        sx={{
                                                                            width: expanded[value.id] ? 8 : 6,
                                                                            height: expanded[value.id] ? 8 : 6,
                                                                            minWidth: '18px'
                                                                        }}
                                                                        fontSize={'medium'}
                                                                    /> 
                                                                </ListItemIcon>
                                                                <ListItemText>{valueChild.text}</ListItemText>   
                                                            </ListItem>
                                                        </LightTooltip>
                                                    )
                                                }
                                                return(
                                                    <Link key={valueChild.id}  href={valueChild.url ?? ""} passHref style={{width: '100%', textDecoration: 'none', color: 'inherit'}} onClick={() => {
                                                        setSelectedUrl(valueChild.url)
                                                    }}>
                                                        <ListItemButton 
                                                            selected={selectedUrl == valueChild.url} 
                                                        >
                                                            <ListItemIcon sx={{ my: 'auto', minWidth: 18}}> 
                                                                <FiberManualRecordIcon 
                                                                    sx={{
                                                                        width: expanded[value.id] ? 8 : 6,
                                                                        height: expanded[value.id] ? 8 : 6,
                                                                        minWidth: '18px'
                                                                    }}
                                                                    fontSize={'medium'}
                                                                /> 
                                                            </ListItemIcon>
                                                            <ListItemText>{valueChild.text}</ListItemText>   
                                                        </ListItemButton>
                                                    </Link>
                                                )
                                            })
                                        }
                                    </List>
                                }>
                                    <ListItemButton 
                                        onClick={() => setOpenedTooltip(value.id)} 
                                        selected={expanded[value.id]} 
                                        sx={{padding: '0px'}}
                                    >
                                        <ListItemIcon sx={{height: '46px', width: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                            {Icon}
                                        </ListItemIcon>
                                    </ListItemButton>
                                </LightTooltip>
                        </>
                        
                    }
                </List>
            }else{
                return null
            }
        })
    )
    // set loading when generate menu
    if(menuAccess.length == 0){
        return(
            <Box width={'100%'} height={'100%'} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} gap={'1rem'}>
                <CircularProgress color='primary' size={'4rem'}/>
                <Typography variant='h6'>Loading Menu Please Wait</Typography>
            </Box>
        )
    }

    if(!isCollapsed){
        return(generateDrawer(menuList))
    }else{
        return(generateMiniDrawer(menuList))
    }
}

export default CustomDrawer