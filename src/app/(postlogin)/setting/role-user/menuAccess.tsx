import { Dialogs } from "@/components/dialog"
import { Box, Button, Checkbox, CircularProgress, TextField, Typography } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { MenuListType, menuList } from "../../menuList";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { EXPORT_MENU_ACCESS, GET_MENU_ACCESS, SAVE_MENU_ACCESS } from "@/lib/redux/types";
import { receiveMenuAccess } from "@/lib/redux/slices/master/menuAccess";
import { IosShare, Save } from "@mui/icons-material";
import ActionButtonResponsive from "@/components/ActionButtonResponsive";

type FormMenuAccessType = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    data: {
        id?: number,
        role?: string,
        created_at?: string,
        created_nik?: number,
        created_by?: string,
        updated_at?: string,
        updated_nik?: number,
        updated_by?: string,
    }
}

type CheckedDataType = {
    menu: string,
    show: boolean,
    create: boolean,
    edit: boolean,
    delete: boolean,
    [key: string]: any
}

const FormMenuAccess = ({ open, data, setOpen }: FormMenuAccessType) => {
    const dispatch = useDispatch()
    const { fetching, menuAccess, error } = useSelector((state: RootState) => state.menuAccess)
    const [checkData, setCheckData] = useState<CheckedDataType[]>([])
    const [checkAllShow, setCheckAllShow] = useState<boolean>(false)
    const [checkAllCreate, setCheckAllCreate] = useState<boolean>(false)
    const [checkAllEdit, setCheckAllEdit] = useState<boolean>(false)
    const [checkAllDelete, setCheckAllDelete] = useState<boolean>(false)
    const { severity } = useSelector((state: RootState) => state.notification)

    // set data to form menu access when modal open and reset when close
    useEffect(() => {
        if (!open) {
            dispatch(receiveMenuAccess([]))
        } else {
            dispatch({ type: GET_MENU_ACCESS, role_id: data.id })
        }
    }, [open])

    // set checked menu when menu access loaded
    useEffect(() => {
        let initMenuAccess = Array<CheckedDataType>()
        const putMenuAccess = (id: string) => {
            const idx = menuAccess.findIndex((val) => val.menu == id)
            if (idx > -1) {
                initMenuAccess.push({
                    menu: menuAccess[idx].menu,
                    show: menuAccess[idx].show,
                    create: menuAccess[idx].create,
                    edit: menuAccess[idx].edit,
                    delete: menuAccess[idx].delete,
                })
            } else {
                initMenuAccess.push({
                    menu: id,
                    show: false,
                    create: false,
                    edit: false,
                    delete: false,
                })
            }
        }
        menuList.forEach((parentMenu) => {
            putMenuAccess(parentMenu.id)
            if (parentMenu.child) {
                parentMenu.child.forEach((data) => {
                    putMenuAccess(data.id)
                })
            }
        })
        setCheckData(initMenuAccess)
    }, [menuAccess])

    // handle event when checkbox value change
    const handleChangeCheckBox = (id: string, permission: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const findIndex = checkData.findIndex(value => value.menu == id)
        if (findIndex != -1) {
            setCheckData(checkData.map(value => {
                if (value.menu == id) {
                    value[permission] = event.target.checked
                }

                return value
            }))
        } else {
            setCheckData([
                ...checkData,
                {
                    ...{
                        show: false,
                        create: false,
                        edit: false,
                        delete: false
                    },
                    menu: id,
                    [permission]: event.target.checked
                }
            ])
        }
    };

    // when check all show clicked
    useEffect(() => {
        setCheckData(checkData.map(value => {
            return {
                menu: value.menu,
                show: checkAllShow,
                create: value.create,
                edit: value.edit,
                delete: value.delete,
            }
        }))
    }, [checkAllShow])

    // when check all create clicked
    useEffect(() => {
        setCheckData(checkData.map(value => {
            return {
                menu: value.menu,
                show: value.show,
                create: checkAllCreate,
                edit: value.edit,
                delete: value.delete,
            }
        }))
    }, [checkAllCreate])

    // when check all edit clicked
    useEffect(() => {
        setCheckData(checkData.map(value => {
            return {
                menu: value.menu,
                show: value.show,
                create: value.create,
                edit: checkAllEdit,
                delete: value.delete,
            }
        }))
    }, [checkAllEdit])

    // when check all delete clicked
    useEffect(() => {
        setCheckData(checkData.map(value => {
            return {
                menu: value.menu,
                show: value.show,
                create: value.create,
                edit: value.edit,
                delete: checkAllDelete,
            }
        }))
    }, [checkAllDelete])

    // element menu access
    const renderTree = (menu: MenuListType[]) =>
        menu.map(value =>
            <TreeItem
                key={value.id}
                nodeId={value.id}
                label={
                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>{value.text}</Typography>
                        <Box display={'flex'} flexDirection={'row'} width={'240px'} justifyContent={'space-between'}>
                            {
                                value.child == undefined &&
                                <>

                                    <Box width={'60px'} textAlign={'center'}>
                                        <Checkbox checked={checkData.find(valueCheck => valueCheck.menu == value.id)?.show || false} onChange={handleChangeCheckBox(value.id, 'show')} />
                                    </Box>
                                    {
                                        value.canCreate && <Box width={'60px'} textAlign={'center'}>
                                            <Checkbox checked={checkData.find(valueCheck => valueCheck.menu == value.id)?.create || false} onChange={handleChangeCheckBox(value.id, 'create')} />
                                        </Box>
                                    }
                                    {
                                        value.canEdit && <Box width={'60px'} textAlign={'center'}>
                                            <Checkbox checked={checkData.find(valueCheck => valueCheck.menu == value.id)?.edit || false} onChange={handleChangeCheckBox(value.id, 'edit')} />
                                        </Box>
                                    }
                                    {
                                        value.canDelete && <Box width={'60px'} textAlign={'center'}>
                                            <Checkbox checked={checkData.find(valueCheck => valueCheck.menu == value.id)?.delete || false} onChange={handleChangeCheckBox(value.id, 'delete')} />
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

    // submit menu access
    const onSubmit = () => {
        dispatch({
            type: SAVE_MENU_ACCESS, data: checkData.map(value => {
                value.role_id = data.id

                return value
            }), role_id: data.id
        })
    }

    const onExportButtonClick = () => {
        dispatch({ type: GET_MENU_ACCESS, role_id: data.id })
        dispatch({ type: EXPORT_MENU_ACCESS, role_id: data.id })
    }

    useEffect(() => {
        if (severity == 'success') {
            setOpen(false)
        }
    }, [severity])

    return (
        <Dialogs
            open={open}
            title={`Form Menu Access`}
            setOpen={setOpen}
        >
            <Box display={'flex'} gap={'1rem'} flexDirection={'column'}>
                <Box display={'flex'} gap={'1rem'} justifyContent={'space-between'}>
                    <Box maxWidth={'200px'}>
                        <TextField label="Role" variant="standard" disabled value={data.role} fullWidth />
                    </Box>
                    <Box maxWidth={'200px'}>
                        <ActionButtonResponsive items={[
                            {
                                color: 'secondary',
                                variant: 'contained',
                                size: 'small',
                                onClick: onExportButtonClick,
                                text: 'Export Excel',
                                sx: { color: 'white' },
                                startIcon: <IosShare />
                            },
                        ]}
                        />
                    </Box>
                </Box>
                <Box border={'1px solid #789461'} borderRadius={'8px'}>
                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'} padding={'8px'} borderRadius={'8px 8px 0px 0px'} bgcolor={'#789461'}>
                        <Typography variant="subtitle1" sx={{ flexGrow: 1 }} color={'white'}>Nama Menu</Typography>
                        <Box display={'flex'} flexDirection={'row'} width={'240px'} justifyContent={'space-between'}>
                            <Box alignContent={'center'} textAlign={'center'}>
                                <Typography variant="subtitle1" sx={{ flexGrow: 1 }} width={'60px'} textAlign={'center'} color={'white'}>Access</Typography>
                                <Checkbox style={{ padding: 0 }} checked={checkAllShow} onChange={() => setCheckAllShow(!checkAllShow)} />
                            </Box>
                            <Box alignContent={'center'} textAlign={'center'}>
                                <Typography variant="subtitle1" sx={{ flexGrow: 1 }} width={'60px'} textAlign={'center'} color={'white'}>Create</Typography>
                                <Checkbox style={{ padding: 0 }} checked={checkAllCreate} onChange={() => setCheckAllCreate(!checkAllCreate)} />
                            </Box>
                            <Box alignContent={'center'} textAlign={'center'}>
                                <Typography variant="subtitle1" sx={{ flexGrow: 1 }} width={'60px'} textAlign={'center'} color={'white'}>Edit</Typography>
                                <Checkbox style={{ padding: 0 }} checked={checkAllEdit} onChange={() => setCheckAllEdit(!checkAllEdit)} />
                            </Box>
                            <Box alignContent={'center'} textAlign={'center'}>
                                <Typography variant="subtitle1" sx={{ flexGrow: 1 }} width={'60px'} textAlign={'center'} color={'white'}>Delete</Typography>
                                <Checkbox style={{ padding: 0 }} checked={checkAllDelete} onChange={() => setCheckAllDelete(!checkAllDelete)} />
                            </Box>
                        </Box>
                    </Box>
                    {/* show element loading when fetching data menu access */}
                    {
                        fetching && menuAccess.length == 0 && <Box
                            sx={{ height: 'calc(100vh - 400px)', flexGrow: 1, width: { sm: '100%', xs: 'auto' }, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}
                        >
                            <CircularProgress color='inherit' />
                            <Typography>Load Data Please Wait!</Typography>
                        </Box>
                    }
                    {/* render element menu access */}
                    {
                        !fetching &&
                        <TreeView
                            aria-label="file system navigator"
                            defaultCollapseIcon={<ExpandMoreIcon />}
                            defaultExpandIcon={<ChevronRightIcon />}
                            sx={{ height: 'calc(100vh - 400px)', flexGrow: 1, width: { sm: '100%', xs: 'auto' }, overflowY: 'auto' }}
                        >
                            {renderTree(menuList)}
                        </TreeView>
                    }
                </Box>
                <Box display={'flex'} flexDirection={'row-reverse'} justifyContent={'end'} width={'100%'} marginTop={'1rem'} gap={'1rem'}>
                    <Button color="primary" variant='contained' size="small" type="button" onClick={onSubmit} endIcon={
                        fetching && <CircularProgress color='inherit' size={'1rem'} />
                    } disabled={fetching} startIcon={<Save />}>
                        Submit
                    </Button>
                </Box>
            </Box>
        </Dialogs>
    )
}

export default FormMenuAccess