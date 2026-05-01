import { Analytics, Groups } from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import SettingsIcon from "@mui/icons-material/Settings";

export type MenuListType = {
  id: string;
  text: string;
  url?: string;
  icon?: JSX.Element;
  child?: MenuListType[];
};

export const menuList: MenuListType[] = [
  {
    id: "dashboard",
    text: "Dashboard",
    icon: <DashboardIcon />,
    url: "/dashboard",
  },
  {
    id: "master",
    text: "Master",
    icon: <FolderIcon />,
    child: [
      {
        id: "master/status-lapangan",
        text: "Status Lapangan",
        url: "/master/status-lapangan",
      },
      {
        id: "master/witel",
        text: "Witel",
        url: "/master/witel",
      },
    ],
  },
  {
    id: "transaction",
    text: "Transaction",
    icon: <Groups />,
    child: [
      {
        id: "transaction/daily-man-power",
        text: "Daily Man Power",
        url: "/transaction/daily-man-power",
      },
    ],
  },
  {
    id: "report",
    text: "Report",
    icon: <Analytics />,
    child: [
      {
        id: "report/pt3",
        text: "PT3",
        url: "/report/pt3",
      },
    ],
  },
  {
    id: "setting",
    text: "Setting",
    icon: <SettingsIcon />,
    child: [
      { id: "setting/job-position", text: "Job Position", url: "/setting/job-position" },
      { id: "setting/department-user", text: "Department User", url: "/setting/department-user" },
      { id: "setting/latest-feature", text: "Latest Feature", url: "/setting/latest-feature" },
      { id: "setting/role-user", text: "Role User", url: "/setting/role-user" },
      { id: "setting/menu-access-mobile", text: "Menu Access Mobile", url: "/setting/menu-access-mobile" },
      { id: "setting/user", text: "User", url: "/setting/user" },
    ],
  },
  {
    id: "log",
    text: "Log",
    icon: <FormatListBulletedIcon />,
    child: [
      { id: "log/log-activity", text: "Log Activity", url: "/log/log-activity" },
      { id: "log/log-notification", text: "Notification", url: "/log/log-notification" },
    ],
  },
];