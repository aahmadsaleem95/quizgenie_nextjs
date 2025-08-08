"use client";
import { Col, Row, Typography, Form, Button } from "antd";

import { SearchOutlined } from "@ant-design/icons";
export default function Home() {
  const [form] = Form.useForm();
  return (
    <>
      <Typography.Title level={2} style={{ textAlign: "center" }}>
        Admin Dashboard
      </Typography.Title>
      <Row style={{ marginBottom: "10px" }}>
        <Col span={24}>
          <Form
            form={form}
            // onFinish={onFinish}
            autoComplete="off"
            layout={"inline"}
            style={{ justifyContent: "space-evenly" }}
          >
            <Form.Item>
              <Button type="primary" htmlType="submit">
                <SearchOutlined></SearchOutlined>Search
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}
