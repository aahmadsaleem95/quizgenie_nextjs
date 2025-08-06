"use client";

import { useState } from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  console.log("Hello");

  //from submit
  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const res = await axios.post("/api/auth/login", values);
      if (res.status === 200) {
        const userData = res.data.user;
        setLoading(false);
        toast.success(res.data.message);
        localStorage.setItem(
          "user",
          JSON.stringify({
            _id: userData._id,
            username: userData.username,
            email: userData.email,
            fullname: userData.fullname,
            gender: userData.gender,
            dob: userData.dob,
          })
        );
        router.push("/");
      }
    } catch (error) {
      setLoading(false);
      toast.error("something went wrong");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="login-page">
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={submitHandler}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit" loading={loading}>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
