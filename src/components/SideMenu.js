"use client";

import {
  AppstoreOutlined,
  ShopOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";

import { Menu } from "antd";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export const SideMenu = ({ userDetails }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [selectedKeys, setSelectedKeys] = useState("/");

  const menuItems = [
    {
      label: "Dashboard",
      icon: <AppstoreOutlined />,
      key: "/",
    },
    {
      label: "Courses",
      key: "/course",
      icon: <ShopOutlined />,
    },
    {
      label: "Quizes",
      key: "/quiz",
      icon: <ShopOutlined />,
    },
  ];

  useEffect(() => {
    setSelectedKeys(pathname);
  }, [pathname]);

  return (
    <div className="SideMenu">
      <Menu
        className="SideMenuVertical"
        mode="vertical"
        onClick={({ key }) => {
          router.push(key);
        }}
        selectedKeys={[selectedKeys]}
        items={menuItems.filter((menu) => {
          const privileges = userDetails?.rolePrivilege?.privileges;
          if (
            !privileges?.includes("CAN_VIEW_REPORTS") &&
            menu.label === "Report"
          ) {
            return false;
          }
          return true;
        })}
      />
    </div>
  );
};
