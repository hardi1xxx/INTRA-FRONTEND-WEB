import Modals from "@/components/modals"
import { Box, Button, Checkbox, TextField, Typography } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { MenuListType, menuList } from "../menuList";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { getMenuAccess } from "@/lib/services";
import { MenuAccessResponse } from "@/lib/services/auth";

type ModalMenuAccessType = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

type Unpacked<T> = T extends (infer U)[] ? U : T;
type MenuAccessType = Unpacked<MenuAccessResponse>

const ModalMenuAccess = ({open,setOpen} : ModalMenuAccessType) => {
    const [checkData,setCheckData] = useState<MenuAccessResponse>([])
        
    // load data menu access
    useEffect(() => {
        const processSetCheckData = async () => {
            const menuAccess = await getMenuAccess()
            setCheckData(menuAccess.result)
        }

        processSetCheckData()
    },[])

    // element list menu access 
    const renderTree = (menu: MenuListType[]) => 
        menu.map(value => 
            <TreeItem 
                key={value.id} 
                nodeId={value.id} 
                label={
                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                        <Typography variant="subtitle1" sx={{flexGrow: 1}}>{value.text}</Typography>
                        <Box display={'flex'} flexDirection={'row'} width={'240px'} justifyContent={'space-between'}>
                            {
                                value.child == undefined &&
                                <>
                                
                                    <Box width={'60px'} textAlign={'center'}>
                                        <Checkbox readOnly disabled checked={checkData.find(valueCheck => valueCheck.menu == value.id)?.show || false} />
                                    </Box>
                                    {
                                        value.canCreate && <Box width={'60px'} textAlign={'center'}>
                                            <Checkbox readOnly disabled checked={checkData.find(valueCheck => valueCheck.menu == value.id)?.create || false} />
                                        </Box>
                                    }
                                    {
                                        value.canEdit && <Box width={'60px'} textAlign={'center'}>
                                            <Checkbox readOnly disabled checked={checkData.find(valueCheck => valueCheck.menu == value.id)?.edit || false} />
                                        </Box>
                                    }
                                    {
                                        value.canDelete && <Box width={'60px'} textAlign={'center'}>
                                            <Checkbox readOnly disabled checked={checkData.find(valueCheck => valueCheck.menu == value.id)?.delete || false} />
                                        </Box>
                                    }
                                </>
                            }
                        </Box>
                    </Box>
                }
                >
            {
                value.child && renderTree(value.child)
            }
            </TreeItem>
        )

    // close modal menu access
    const onCancel = () => {
        setOpen(false)
    }

    return(
        <Modals
            open = {open}
            title = {`Form Menu Access`}
            setOpen={setOpen}
        >
            <Box display={'flex'} gap={'1rem'} flexDirection={'column'}>
                <Box maxWidth={'200px'}>
                    <TextField label="Role" variant="standard" disabled value={getCookie('intra_auth_role')} fullWidth/>
                </Box>
                <Box border={'1px solid #789461'} borderRadius={'8px'}>
                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'} padding={'8px'}  borderRadius={'8px 8px 0px 0px'} bgcolor={'#789461'}>
                        <Typography variant="subtitle1" sx={{flexGrow: 1}} color={'white'}>Nama Menu</Typography>
                        <Box display={'flex'} flexDirection={'row'} width={'240px'} justifyContent={'space-between'}>
                            <Typography variant="subtitle1" sx={{flexGrow: 1}} width={'60px'} textAlign={'center'} color={'white'}>Access</Typography>
                            <Typography variant="subtitle1" sx={{flexGrow: 1}} width={'60px'} textAlign={'center'} color={'white'}>Create</Typography>
                            <Typography variant="subtitle1" sx={{flexGrow: 1}} width={'60px'} textAlign={'center'} color={'white'}>Edit</Typography>
                            <Typography variant="subtitle1" sx={{flexGrow: 1}} width={'60px'} textAlign={'center'} color={'white'}>Delete</Typography>
                        </Box>
                    </Box>
                        <TreeView
                            aria-label="file system navigator"
                            defaultCollapseIcon={<ExpandMoreIcon />}
                            defaultExpandIcon={<ChevronRightIcon />}
                            sx={{ height: 380, flexGrow: 1, width: {sm: 700, xs: 'auto'}, overflowY: 'auto' }}
                            >
                                {renderTree(menuList)}
                        </TreeView>
                </Box>
                <Box display={'flex'} flexDirection={'row-reverse'} justifyContent={'end'} width={'100%'} marginTop={'1rem'} gap={'1rem'}>
                    <Button color="error" variant='contained' size="small" type="button" onClick={onCancel}>
                        Close
                    </Button>
                </Box>
            </Box>
        </Modals>
    )
}

export default ModalMenuAccess