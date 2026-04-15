'use client'

import { usePathname } from "next/navigation"
import { MenuListType, menuList } from "./menuList"
import { useMemo } from "react"

export type CheckedDataType = {
    menu: string,
    show: boolean,
    create: boolean,
    edit: boolean,
    delete: boolean,
    [key: string]: any
}
export default function useMenuAccessRepo() {
    const pathname = usePathname()
    let activeAuthMenuAccess = useMemo(() => {
        const authMenuAccess: CheckedDataType[] | null = (typeof window != 'undefined' ? JSON.parse((localStorage.getItem('costing_auth_menu_access')) ?? '') : null) ?? null
        let activeMenu: MenuListType | null = null
        for (const menu of menuList) {
            let findMenu = (menu.child)
                ? menu.child?.find((data) => data.url && data.url == pathname)
                : menuList.find((data) => data.url && data.url == pathname)
            if (findMenu) {
                activeMenu = findMenu
                break
            }
        }
        return authMenuAccess != null && activeMenu
            ? authMenuAccess.find(menu => menu.menu == activeMenu?.id)
            : undefined
    }, [pathname])

    const permissions = {
        allowShow: activeAuthMenuAccess?.show ?? true,
        allowCreate: activeAuthMenuAccess?.create ?? true,
        allowEdit: activeAuthMenuAccess?.edit ?? true,
        allowDelete: activeAuthMenuAccess?.delete ?? true,
    }
    const isHavePermission = (val: string) => {
        const detectedKey = ['show', 'export', 'delete', 'edit', 'upload', 'create']
        if (!detectedKey.includes(val.toLowerCase()))
            return true
        if (['show', 'export'].includes(val.toLowerCase()))
            return permissions.allowShow
        if (['create', 'upload'].includes(val.toLowerCase()))
            return permissions.allowCreate
        if (val.toLowerCase() === 'edit')
            return permissions.allowEdit
        if (val.toLowerCase() === 'delete')
            return permissions.allowDelete
    }

    return {
        ...permissions,
        isHavePermission
    }

}