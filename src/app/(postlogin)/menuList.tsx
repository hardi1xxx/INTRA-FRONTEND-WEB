import { Analytics } from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import SettingsIcon from "@mui/icons-material/Settings";

export type MenuListType = {
  id: string;
  text: string;
  url?: string;
  icon?: JSX.Element;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  child?: MenuListType[];
};

export const menuList: MenuListType[] = [
  // Dashboard
  {
    id: "dashboard",
    text: "Dashboard",
    icon: <DashboardIcon />,
    url: "/dashboard",
    canCreate: false,
    canEdit: false,
    canDelete: false,
  },

  // Master
  {
    id: "master",
    text: "Master",
    icon: <FolderIcon />,
    child: [
      {
        id: "master/shift",
        text: "Shift",
        url: "/master/shift",
        canCreate: true,
        canEdit: true,
        canDelete: true,
      },
    ],
  },

  // Report
  {
    id: "report",
    text: "Report",
    icon: <Analytics />,
    child: [
      {
        id: "report/pt3",
        text: "PT3",
        url: "/report/pt3",
        canCreate: true,
        canEdit: true,
        canDelete: true,
      },
    ],
  },

  // Setting
  {
    id: "setting",
    text: "Setting",
    icon: <SettingsIcon />,
    child: [
      {
        id: "setting/job-position",
        text: "Job Position",
        url: "/setting/job-position",
        canCreate: true,
        canEdit: true,
        canDelete: true,
      },
      {
        id: "setting/department-user",
        text: "Department User",
        url: "/setting/department-user",
        canCreate: true,
        canEdit: true,
        canDelete: true,
      },
      {
        id: "setting/latest-feature",
        text: "Latest Feature",
        url: "/setting/latest-feature",
        canCreate: true,
        canEdit: true,
        canDelete: true,
      },
      {
        id: "setting/role-user",
        text: "Role User",
        url: "/setting/role-user",
        canCreate: true,
        canEdit: true,
        canDelete: true,
      },
      {
        id: "setting/menu-access-mobile",
        text: "Menu Access Mobile",
        url: "/setting/menu-access-mobile",
        canCreate: true,
        canEdit: true,
        canDelete: true,
      },
      {
        id: "setting/user",
        text: "User",
        url: "/setting/user",
        canCreate: true,
        canEdit: true,
        canDelete: true,
      },
    ],
  },
  // Log
  {
    id: 'log',
    text: 'Log',
    icon: <FormatListBulletedIcon />,
    child: [
      {
        id: 'log/log-activity',
        text: 'Log Activity',
        url: '/log/log-activity',
        canCreate: false,
        canEdit: false,
        canDelete: false,
      },
      {
        id: 'log/log-notification',
        text: 'Notification',
        url: '/log/log-notification',
        canCreate: false,
        canEdit: false,
        canDelete: false,
      },
    ],
  },
];