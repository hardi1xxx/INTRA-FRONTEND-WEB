import React, { useEffect, useState } from "react";

export default function usePermission(id: string) {
  const [permission, setPermission] = useState({
    access: false,
    create: false,
    edit: false,
    delete: false,
  });

  useEffect(() => {
    if (typeof window == "undefined") return;
    setPermission({
      access: false,
      create: false,
      delete: false,
      edit: false,
    });
    if ((JSON.parse(window.localStorage.getItem("intra_auth_menu_access") ?? "[]") as string[]).includes(id)) {
      setPermission((prev) => ({ ...prev, access: true }));
    }
    if ((JSON.parse(window.localStorage.getItem("intra_auth_menu_access_create") ?? "[]") as string[]).includes(id)) {
      setPermission((prev) => ({ ...prev, create: true }));
    }
    if ((JSON.parse(window.localStorage.getItem("intra_auth_menu_access_edit") ?? "[]") as string[]).includes(id)) {
      setPermission((prev) => ({ ...prev, edit: true }));
    }
    if ((JSON.parse(window.localStorage.getItem("intra_auth_menu_access_delete") ?? "[]") as string[]).includes(id)) {
      setPermission((prev) => ({ ...prev, delete: true }));
    }
  }, [id]);

  return permission;
}
