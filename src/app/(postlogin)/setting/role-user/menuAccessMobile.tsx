import { DataRole } from "@/lib/redux/slices/master/role"
import { MenuListType } from "../../menuList"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/lib/redux/store"
import { EXPORT_MENU_ACCESS_MOBILE_BY_ROLE_ID, GET_MENU_ACCESS_MOBILE_BY_ROLE_ID, SAVE_MENU_ACCESS_MOBILE_BY_ROLE_ID } from "@/lib/redux/types"
import { receiveMenuAccessMobileByRole } from "@/lib/redux/slices/master/menuAccessMobile"
import { CheckedDataType } from "../../menuAccessRepo"
import React, { useEffect, useState } from "react"
import { Box, Button, Checkbox, CircularProgress, TextField, Typography } from "@mui/material"
import { TreeItem2, TreeItem2Props } from "@mui/x-tree-view/TreeItem2"
import LibraryAddCheckOutlinedIcon from '@mui/icons-material/LibraryAddCheckOutlined';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import ActionButtonResponsive from "@/components/ActionButtonResponsive"
import { Dialogs } from "@/components/dialog"
import { IosShare, Save } from "@mui/icons-material"
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView"
import { useTreeItem2Utils } from "@mui/x-tree-view/hooks"
import { UseTreeItem2ContentSlotOwnProps } from "@mui/x-tree-view/useTreeItem2"
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';

const CustomTreeItem = React.forwardRef(function MyTreeItem(
    props: TreeItem2Props,
    ref: React.Ref<HTMLLIElement>,
) {
    const { interactions } = useTreeItem2Utils({
        itemId: props.itemId,
        children: props.children,
    });

    const handleContentClick: UseTreeItem2ContentSlotOwnProps['onClick'] = (event) => {
        event.defaultMuiPrevented = true;
        interactions.handleSelection(event);
    };

    const handleIconContainerClick = (event: React.MouseEvent) => {
        interactions.handleExpansion(event);
    };

    return (
        <TreeItem2
            {...props}
            ref={ref}
            slotProps={{
                content: { onClick: handleContentClick },
                iconContainer: { onClick: handleIconContainerClick },
            }}
        />
    );
});

type FormMenuAccessMobileType = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    data: DataRole,
    menuList: MenuListType[],
}

const FormMenuAccessMobile = ({ open, data, setOpen, menuList }: FormMenuAccessMobileType) => {
    const dispatch = useDispatch()
    const { fetching, menuAccess } = useSelector((state: RootState) => state.menuAccessMobile)
    const [checkData, setCheckData] = useState<CheckedDataType[]>([])
    const { severity } = useSelector((state: RootState) => state.notification)

    // set data to form menu access when modal open and reset when close
    useEffect(() => {
        if (!open) {
            dispatch(receiveMenuAccessMobileByRole([]))
        } else {
            dispatch({ type: GET_MENU_ACCESS_MOBILE_BY_ROLE_ID, role_id: data.id })
        }
    }, [open, dispatch, data])

    // set checked menu when menu access loaded
    useEffect(() => {
        let initMenuAccess = Array<CheckedDataType>()
        const putMenuAccess = (id: string) => {
            const idx = menuAccess.findIndex((val: any) => val.menu == id)
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
                    if (data.child) {
                        data.child.forEach((child2) => {
                            putMenuAccess(child2.id)
                        })
                    }
                })
            }
        })
        setCheckData(initMenuAccess)
    }, [menuAccess, menuList])

    // handle event when checkbox value change
    const handleChangeCheckBox = (id: string, permission: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const findIndex = checkData.findIndex(value => value.menu == id)
        // fungsi untuk men set child menu ketika parent menu diklik 
        const menuChildSetter = (menu: MenuListType) => {
            menu.child?.forEach(childMenu => {
                setCheckData(checkData.map(value => {
                    if (value.menu == childMenu.id) {
                        value[permission] = event.target.checked
                    }

                    return value
                }))
                childMenu.child?.forEach(childMenu2 => {
                    setCheckData(checkData.map(value => {
                        if (value.menu == childMenu2.id) {
                            value[permission] = event.target.checked
                        }

                        return value
                    }))
                })
            });
            handleCheckedParent()
        }

        // handle ketika parent menu checkbox di klik 
        const findMenu = menuList.find(val => val.id == id)
        if (findMenu && findMenu?.child) {
            setCheckData(checkData.map(value => {
                if (value.menu == id) {
                    value[permission] = event.target.checked
                }

                return value
            }))
            return menuChildSetter(findMenu)
        }
        // handle ketika child menu memiliki child lagi dan menu child parent select all di klik 
        const findParentMenu = menuList.find(val => val.child?.find((child) => child.id == id))
        const findChildParentMenu = findParentMenu?.child?.find(child => child.id == id)
        if (findChildParentMenu) {
            const parentChildMenu = findChildParentMenu?.child?.find((data) => data.id == id)
            setCheckData(checkData.map(value => {
                if (value.menu == id) {
                    value[permission] = event.target.checked
                }

                return value
            }))
            if (parentChildMenu) {
                return menuChildSetter(parentChildMenu)
            }
            if (findChildParentMenu.child) {
                return menuChildSetter(findChildParentMenu)
            }
        }

        // handle ketika child menu checkbox di klik
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
        handleCheckedParent()
    };
    //handle select all checkbox
    const handleChangeSelecetAll = (permission: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckData(checkData.map(value => {
            value[permission] = event.target.checked
            return value
        }))
    }

    // function for handle checked parent when child onclicked
    const handleCheckedParent = () => {
        for (const menu of menuList) {
            if (menu.child) {
                const childs1 = menu.child
                let countShow = 0, countCreate = 0, countDelete = 0, countEdit = 0
                for (const child1 of childs1) {
                    if (child1.child) {
                        const childs2 = child1.child
                        let countShow2 = 0, countCreate2 = 0, countDelete2 = 0, countEdit2 = 0
                        for (const child2 of childs2) {
                            const findMenu2 = checkData.find(val => val.menu == child2.id)
                            if (findMenu2) {
                                countShow2 += findMenu2.show ? 1 : 0
                                countCreate2 += findMenu2.create ? 1 : 0
                                countDelete2 += findMenu2.delete ? 1 : 0
                                countEdit2 += findMenu2.edit ? 1 : 0
                            }
                        }
                        setCheckData(checkData.map(value => {
                            if (value.menu == child1.id) {
                                value['show'] = child1.child?.length == countShow2
                                value['create'] = child1.child?.length == countCreate2
                                value['edit'] = child1.child?.length == countEdit2
                                value['delete'] = child1.child?.length == countDelete2
                            }
                            return value
                        }))
                        countShow += child1.child?.length == countShow2 ? 1 : 0
                        countCreate += child1.child?.length == countCreate2 ? 1 : 0
                        countDelete += child1.child?.length == countDelete2 ? 1 : 0
                        countEdit += child1.child?.length == countEdit2 ? 1 : 0
                    } else {
                        const findMenu = checkData.find(val => val.menu == child1.id)
                        if (findMenu) {
                            countShow += findMenu.show ? 1 : 0
                            countCreate += findMenu.create ? 1 : 0
                            countDelete += findMenu.delete ? 1 : 0
                            countEdit += findMenu.edit ? 1 : 0
                        }
                    }
                }
                setCheckData(checkData.map(value => {
                    if (value.menu == menu.id) {
                        value['show'] = menu.child?.length == countShow
                        value['create'] = menu.child?.length == countCreate
                        value['edit'] = menu.child?.length == countEdit
                        value['delete'] = menu.child?.length == countDelete
                    }
                    return value
                }))
            }
        }
    }

    // element menu access
    const renderTree = (menu: MenuListType[]) =>
        menu.map((value: MenuListType) =>
            <CustomTreeItem
                key={value.id}
                itemId={value.id}
                label={
                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                        <Box display={'flex'} flexDirection={'row'} width={'240px'} justifyContent={'space-between'}>
                            <Typography variant="subtitle1" sx={{ flexGrow: 1, overflow: 'hidden', wordWrap: 'break-word' }}>{value.text}</Typography>
                        </Box>
                        <Box display={'flex'} flexDirection={'row'} width={'240px'} justifyContent={'space-between'}>
                            <Box width={'60px'} textAlign={'center'}>
                                <Checkbox icon={value.child ? <LibraryAddCheckOutlinedIcon color="primary" /> : undefined}
                                    checkedIcon={value.child ? <LibraryAddCheckIcon color="primary" /> : undefined}
                                    checked={checkData.find(valueCheck => valueCheck.menu == value.id)?.show || false}
                                    onChange={handleChangeCheckBox(value.id, 'show')} />
                            </Box>
                            {
                                (value.child || value.canCreate) ?
                                <Box width={'60px'} textAlign={'center'}>
                                    <Checkbox icon={value.child ? <LibraryAddCheckOutlinedIcon color="primary" /> : undefined}
                                        checkedIcon={value.child ? <LibraryAddCheckIcon color="primary" /> : undefined}
                                        checked={checkData.find(valueCheck => valueCheck.menu == value.id)?.create || false}
                                        onChange={handleChangeCheckBox(value.id, 'create')} />
                                </Box> : <Box width={'60px'} textAlign={'center'}></Box>
                            }
                            {
                                (value.child || value.canEdit) ?
                                <Box width={'60px'} textAlign={'center'}>
                                    <Checkbox icon={value.child ? <LibraryAddCheckOutlinedIcon color="primary" /> : undefined}
                                        checkedIcon={value.child ? <LibraryAddCheckIcon color="primary" /> : undefined}
                                        checked={checkData.find(valueCheck => valueCheck.menu == value.id)?.edit}
                                        onChange={handleChangeCheckBox(value.id, 'edit')} />
                                </Box> : <Box width={'60px'} textAlign={'center'}></Box>
                            }
                            {
                                (value.child || value.canDelete) ?
                                <Box width={'60px'} textAlign={'center'}>
                                    <Checkbox icon={value.child ? <LibraryAddCheckOutlinedIcon color="primary" /> : undefined}
                                        checkedIcon={value.child ? <LibraryAddCheckIcon color="primary" /> : undefined}
                                        checked={checkData.find(valueCheck => valueCheck.menu == value.id)?.delete}
                                        onChange={handleChangeCheckBox(value.id, 'delete')} />
                                </Box> : <Box width={'60px'} textAlign={'center'}></Box>
                            }
                        </Box>
                    </Box>
                }
            >
                {
                    value.child && renderTree(value.child)
                }
            </CustomTreeItem>
        )

    // submit menu access
    const onSubmit = () => {
        dispatch({
            type: SAVE_MENU_ACCESS_MOBILE_BY_ROLE_ID, data: checkData.map(value => {
                value.role_id = data.id

                return value
            }), role_id: data.id
        })

    }

    const onExportButtonClick = () => {
        dispatch({ type: EXPORT_MENU_ACCESS_MOBILE_BY_ROLE_ID, role_id: data.id })
    }

    useEffect(() => {
        if (severity == 'success' && open) {
            setOpen(false)
        }
    }, [severity, setOpen, open])

    return (
        <Dialogs
            open={open}
            title={`Form Menu Access Mobile`}
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
                                color: 'info',
                                variant: 'contained',
                                size: 'small',
                                onClick: onExportButtonClick,
                                text: 'Export',
                                sx: { color: 'white' },
                                startIcon: <IosShare />
                            },
                        ]}
                        />
                    </Box>
                </Box>
                <Box border={'1px solid #825f4f'} borderRadius={'8px'}>
                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'} padding={'8px'} borderRadius={'8px 8px 0px 0px'} bgcolor={'#825f4f'}>
                        <Typography variant="subtitle1" sx={{ flexGrow: 1 }} color={'white'}>Nama Menu</Typography>
                        <Box display={'flex'} flexDirection={'row'} width={'240px'} justifyContent={'space-between'}>
                            <Box alignContent={'center'} textAlign={'center'}>
                                <Typography variant="subtitle1" sx={{ flexGrow: 1 }} width={'60px'} textAlign={'center'} color={'white'}>Access</Typography>
                                <Checkbox icon={<CheckBoxOutlineBlankOutlinedIcon color="primary" />} style={{ padding: 0 }} onChange={handleChangeSelecetAll('show')} />
                            </Box>
                            <Box alignContent={'center'} textAlign={'center'}>
                                <Typography variant="subtitle1" sx={{ flexGrow: 1 }} width={'60px'} textAlign={'center'} color={'white'}>Create</Typography>
                                <Checkbox icon={<CheckBoxOutlineBlankOutlinedIcon color="primary" />} style={{ padding: 0 }} onChange={handleChangeSelecetAll('create')} />
                            </Box>
                            <Box alignContent={'center'} textAlign={'center'}>
                                <Typography variant="subtitle1" sx={{ flexGrow: 1 }} width={'60px'} textAlign={'center'} color={'white'}>Edit</Typography>
                                <Checkbox icon={<CheckBoxOutlineBlankOutlinedIcon color="primary" />} style={{ padding: 0 }} onChange={handleChangeSelecetAll('edit')} />
                            </Box>
                            <Box alignContent={'center'} textAlign={'center'}>
                                <Typography variant="subtitle1" sx={{ flexGrow: 1 }} width={'60px'} textAlign={'center'} color={'white'}>Delete</Typography>
                                <Checkbox icon={<CheckBoxOutlineBlankOutlinedIcon color="primary" />} style={{ padding: 0 }} onChange={handleChangeSelecetAll('delete')} />
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
                        <SimpleTreeView
                            aria-label="file system navigator"
                            sx={{ height: 'calc(100vh - 400px)', flexGrow: 1, width: { sm: '100%', xs: 'auto' }, overflowY: 'auto' }}
                        >
                            {renderTree(menuList)}
                        </SimpleTreeView>
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

export default FormMenuAccessMobile