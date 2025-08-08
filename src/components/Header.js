"use client";

import React, { useState, useEffect } from "react";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Badge, Avatar, Space, Typography, message } from "antd";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export const Header = () => {
  const [loginUser, setLoginUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        setLoginUser(JSON.parse(userCookie));
      } catch {
        setLoginUser(null);
      }
    }
  }, []);

  const logoutHandler = () => {
    Cookies.remove("user"); // Remove the user cookie
    localStorage.removeItem("user");
    toast.success("Logout Successfully");
    router.push("/login");
  };

  return (
    <div
      className="AppHeader"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Space>
        <Avatar size={"large"} icon={<UserOutlined />} />
        <Typography.Text>{loginUser?.fullname || "Admin"}</Typography.Text>
      </Space>
      <Typography.Title level={3}>
        Expense Management Dashboard
      </Typography.Title>
      <Space>
        <Badge count={0}>
          <LogoutOutlined
            style={{ fontSize: 24, rotate: "270deg", cursor: "pointer" }}
            onClick={logoutHandler}
          />
        </Badge>
      </Space>
    </div>
  );
};
