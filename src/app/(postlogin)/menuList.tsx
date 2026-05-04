import { Analytics, Groups } from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
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
        id: "master/batch",
        text: "Batch",
        url: "/master/batch",
      },
      {
        id: "master/status-project",
        text: "Status Project",
        url: "/master/status-project",
      },
      {
        id: "master/kategori-project",
        text: "Kategori Project",
        url: "/master/kategori-project",
      },
      {
        id: "master/mitra",
        text: "Mitra",
        url: "/master/mitra",
      },
      {
        id: "master/regional",
        text: "Regional",
        url: "/master/regional",
      },
      {
        id: "master/area",
        text: "Area",
        url: "/master/area",
      },
      {
        id: "master/branch",
        text: "Branch",
        url: "/master/branch",
      },
      {
        id: "master/sto",
        text: "STO",
        url: "/master/sto",
      },
    ],
  },
  {
    id: "transaction",
    text: "Transaction",
    icon: <Groups />,
    child: [
      {
        id: "transaction/deployment",
        text: "Deployment",
        url: "/transaction/deployment",
      },
    ],
  },
  {
    id: "report",
    text: "Report",
    icon: <Analytics />,
    child: [
      {
        id: "report/deployment",
        text: "Deployment",
        url: "/report/deployment",
      },
    ],
  },
  {
    id: "setting",
    text: "Setting",
    icon: <SettingsIcon />,
    child: [
      { id: "setting/role", text: "Role", url: "/setting/role" },
      { id: "setting/user", text: "User", url: "/setting/user" },
      { id: "setting/menu", text: "Menu", url: "/setting/menu" },
    ],
  }
];