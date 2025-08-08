"use client";

import React, { useState, useEffect } from "react";
import { Button, Typography, Form, Select } from "antd";
import { useParams, useRouter } from "next/navigation";
import { AddRecord } from "@/components/AddRecord";
import { EditRecord } from "@/components/EditRecord";
import { TableView } from "@/components/TableView";
import { PlaySquareTwoTone } from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";

export default function Quiz({ userInfo }) {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const colData = [
    {
      title: "Name",
      dataIndex: "name",
      render: (record) => record?.toUpperCase(),
    },
    {
      title: "Course",
      dataIndex: "courseId",
      render: (record) => `${record?.code}-${record?.name.toUpperCase()}`,
    },
    {
      title: "Total Question",
      dataIndex: "totalQuestion",
    },
    {
      title: "Marks",
      dataIndex: "marks",
    },
    {
      title: "Quiz Link",
      dataIndex: "_id",
      render: (record) => (
        <PlaySquareTwoTone onClick={() => router.push(`/quiz/${record}`)} />
      ),
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
  const [allCourses, setAllCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");

  const getAllCourses = async () => {
    return axios.get("/api/course");
  };
  const createQuiz = async (values) => {
    return axios.post("/api/quiz", values);
  };
  const getAllQuizes = async () => {
    return axios.get("/api/quiz");
  };
  const getQuizById = async (id) => {
    return axios.get(`/api/quiz/${id}`);
  };
  const updateQuiz = async (id, values) => {
    return axios.put(`/api/quiz/${id}`, values);
  };
  const deleteQuiz = async (id) => {
    return axios.delete(`/api/quiz/${id}`);
  };
  const getAllQuizesByCourseId = async (id) => {
    return axios.get(`/api/quiz/course/${id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let res;
        if (selectedCourse) {
          res = await getAllQuizesByCourseId(selectedCourse);
        } else {
          res = await getAllQuizes();
        }
        if (res?.status === 200) {
          setDataSource(res.data.quizzes);
        }
      } catch (error) {
        if (error.code !== "ERR_NETWORK") {
          toast.error(error.message);
        }
      }

      try {
        const res = await getAllCourses();
        if (res?.status === 200) {
          setAllCourses(res.data.courses);
        }
      } catch (error) {
        if (error.code !== "ERR_NETWORK") {
          toast.error(error.message);
        }
      }

      setReload(false);
      setLoading(false);
    };

    fetchData();
  }, [reload, selectedCourse]);

  useEffect(() => {
    setFormFields([
      {
        title: "Name",
        dataIndex: "name",
        type: "text",
        require: true,
      },
      {
        title: "Course",
        dataIndex: "courseId",
        type: "dropdown",
        require: true,
        data: allCourses,
        dataTitle: "name",
      },
      {
        title: "Total Question",
        dataIndex: "totalQuestion",
        type: "number",
        require: true,
      },
      {
        title: "Marks",
        dataIndex: "marks",
        type: "number",
        require: true,
      },
      {
        title: "Questions JSON",
        dataIndex: "questionsJson",
        type: "textarea",
        require: true,
      },
    ]);
  }, [allCourses]);

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
    if (event !== "cancel") setReload(true);
  };

  const resetAdding = (event) => {
    setIsAdding(false);
    if (event !== "cancel") setReload(true);
  };

  return (
    <div className="TContent">
      <div className="THeader">
        <Typography.Title level={4}>Quiz Details</Typography.Title>
        <div>
          <Select
            placeholder={"Select a Course"}
            style={{ width: 320, marginRight: 20 }}
            onChange={(value) => setSelectedCourse(value)}
            allowClear
            options={allCourses.map((course) => ({
              value: course._id,
              label: `${course.code}-${course.name.toUpperCase()}`,
            }))}
          />
          <Button
            type="primary"
            onClick={() => {
              if (allCourses.length === 0) {
                toast.warning("Create Courses First");
              } else {
                onAddRecord();
              }
            }}
          >
            Add
          </Button>
        </div>
      </div>

      <TableView
        loading={loading}
        dataSource={dataSource}
        rkey="_id"
        columnsData={colData}
        deleteRecord={deleteQuiz}
        form={form}
        formName={"quiz"}
        setIsEditing={[setIsEditing]}
        editingRecord={setSelectedRecord}
        setReload={setReload}
        formFields={formFields}
        editEnable={true}
        delEnable={true}
        getSelectedRecord={getQuizById}
      />

      <EditRecord
        title="Edit Quiz"
        isEditing={isEditing}
        resetEditing={resetEditing}
        form={form}
        updateRecord={updateQuiz}
        editData={selectedRecord}
        formFields={formFields}
        formName={"quiz"}
      />

      <AddRecord
        title="Add Quiz"
        isAdding={isAdding}
        resetAdding={resetAdding}
        form={form}
        addRecord={createQuiz}
        formFields={formFields}
        formName={"quiz"}
      />
    </div>
  );
}
