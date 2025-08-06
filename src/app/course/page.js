"use client";
import { useState, useEffect } from "react";
import { Button, Typography, Form, message } from "antd";
import { AddRecord } from "@/components/AddRecord";
import { EditRecord } from "@/components/EditRecord";
import { TableView } from "@/components/TableView";
import axios from "axios";
import { toast } from "react-toastify";
export default function Course({ userInfo }) {
  const colData = [
    {
      title: "Code",
      dataIndex: "code",
    },
    {
      title: "Title",
      dataIndex: "name",
      render: (record) => record?.toUpperCase(),
    },
    {
      title: "Credit Hrs.",
      dataIndex: "creditHours",
    },
    {
      title: "Modified By",
      dataIndex: "userId",
      render: (record) => {
        return record?.fullname;
      },
    },
  ];
  const [dataSource, setDataSource] = useState([]);
  const [form] = Form.useForm();
  const [formFields, setFormFields] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const createCourse = async (values) => {
    values.userId = JSON.parse(localStorage.getItem("user"))._id;
    return axios.post("/api/course", values);
  };
  const getCourseById = async (id) => {
    return axios.get(`/api/course/${id}`);
  };
  const updateCourse = async (id, values) => {
    values.userId = JSON.parse(localStorage.getItem("user"))._id;
    return axios.put(`/api/course/${id}`, values);
  };
  const deleteCourse = async (id) => {
    return axios.delete(`/api/course/${id}`);
  };
  useEffect(() => {
    setLoading(true);
    const getData = async () => {
      try {
        const res = await axios.get("/api/course");
        if (res?.status === 200) {
          setDataSource(res.data.courses);
        }
      } catch (error) {
        if (error.code !== "ERR_NETWORK") {
          toast.error(error.message);
        }
      }

      setReload(false);
      setLoading(false);
    };

    setFormFields([
      {
        title: "CODE",
        dataIndex: "code",
        type: "text",
        require: true,
      },
      {
        title: "Title",
        dataIndex: "name",
        type: "text",
        require: true,
      },
      {
        title: "Credit Hrs.",
        dataIndex: "creditHours",
        type: "number",
        require: true,
      },
    ]);
    getData();
  }, [reload]);

  const onAddRecord = () => {
    setIsAdding(true);
    const fieldsValue = formFields.reduce((fieldValues, field) => {
      fieldValues[field.dataIndex] = "";
      return fieldValues;
    }, {});
    form.setFieldsValue(fieldsValue);
  };
  const resetEditing = (event) => {
    setIsEditing(false);
    setSelectedRecord(null);
    if (event !== "cancel") {
      setReload(true);
    }
  };
  const resetAdding = (event) => {
    setIsAdding(false);
    if (event !== "cancel") {
      setReload(true);
    }
  };

  return (
    <div className="TContent">
      <div className="THeader">
        <Typography.Title level={4}>Course Details</Typography.Title>
        <Button
          type="primary"
          onClick={() => {
            onAddRecord();
          }}
        >
          Add
        </Button>
      </div>

      <TableView
        loading={loading}
        dataSource={dataSource}
        rkey="_id"
        columnsData={colData}
        deleteRecord={deleteCourse}
        form={form}
        formName={"course"}
        setIsEditing={[setIsEditing]}
        editingRecord={setSelectedRecord}
        setReload={setReload}
        formFields={formFields}
        editEnable={true}
        delEnable={true}
        getSelectedRecord={getCourseById}
      />

      <EditRecord
        title="Edit Courses"
        isEditing={isEditing}
        resetEditing={resetEditing}
        form={form}
        updateRecord={updateCourse}
        editData={selectedRecord}
        formFields={formFields}
        formName={"Courses"}
      />
      <AddRecord
        title="Add Courses"
        isAdding={isAdding}
        resetAdding={resetAdding}
        form={form}
        addRecord={createCourse}
        formFields={formFields}
        formName={"Courses"}
      />
    </div>
  );
}
