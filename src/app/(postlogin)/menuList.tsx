import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import FolderIcon from '@mui/icons-material/Folder';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import React from 'react';

export type MenuListType = {
    id: string;
    text: string;
    url?: string;
    icon?: JSX.Element;
    canCreate?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
    child?: MenuListType[];
}

export const menuList: MenuListType[] = [
    // Dashboard
    {
        id: 'dashboard',
        text: 'Dashboard',
        icon: <DashboardIcon />,
        url: '/dashboard',
        canCreate: false,
        canEdit: false,
        canDelete: false,
    },

    // Master
    {
        id: 'master',
        text: 'Master',
        icon: <FolderIcon />,
        child: [
            {
                id: 'master/waste',
                text: 'Waste',
                url: '/master/waste',
                canCreate: true,
                canEdit: true,
                canDelete: true,
            },
        ]
    },

    // Transaction
    {
        id: 'transaction',
        text: 'Transaction',
        icon: <FolderIcon />,
        child: [
            {
                id: 'transaction/example',
                text: 'Example Transaction',
                url: '/transaction/example',
                canCreate: true,
                canEdit: true,
                canDelete: true,
            }
        ]
    },

    // Report
    {
        id: 'report',
        text: 'Report',
        icon: <FormatListBulletedIcon />,
    },

    // Setting
    {
        id: 'setting',
        text: 'Setting',
        icon: <SettingsIcon />,
        child: [
            {
                id: 'report/user',
                text: 'User',
                url: '/report/user',
                canCreate: true,
                canEdit: true,
                canDelete: true,
            },
            {
                id: 'report/role',
                text: 'Role',
                url: '/report/role',
                canCreate: true,
                canEdit: true,
                canDelete: true,
            },
            {
                id: 'report/menu',
                text: 'Menu',
                url: '/report/menu',
                canCreate: true,
                canEdit: true,
                canDelete: true,
            },
        ]
    },

    // Log Activity
    {
        id: 'log-activity',
        text: 'Log Activity',
        icon: <FormatListBulletedIcon />,
        url: '/log-activity',
        canCreate: false,
        canEdit: false,
        canDelete: false,
    },
]
