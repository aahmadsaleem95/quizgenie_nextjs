"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";

export default function QuizStartPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizData, setQuizData] = useState(null);

  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const getQuizById = async (id) => {
    return axios.get(`/api/quiz/${id}`);
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = () => {
    const answer = quizData.questions[currentQuestion].answer;
    if (selectedOption === answer) {
      setFeedback(`Correct! The answer is ${answer}`);
    } else {
      setFeedback(`Wrong! The correct answer is ${answer}`);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    setCurrentQuestion((prev) => prev + 1);
    setSelectedOption("");
    setFeedback("");
    setShowFeedback(false);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getQuizById(id);
        if (res?.status === 200) {
          setQuizData(res.data.data.questionsJson);
        }
      } catch (error) {
        if (error.code !== "ERR_NETWORK") {
          toast.error(error.message);
        }
      }
    };
    if (id) getData();
  }, [id]);

  if (!quizData) {
    return <div className="app-body">Loading...</div>;
  }

  return (
    <div className="app-body">
      <div className="app">
        <h1>{quizData?.quizTitle}</h1>
        <div className="question">
          <h3>
            Q.No.{currentQuestion + 1}{" "}
            {quizData?.questions[currentQuestion]?.question}
          </h3>
          <ul className="options">
            {quizData?.questions[currentQuestion]?.options.map(
              (option, index) => (
                <li key={index} className="option">
                  <input
                    type="radio"
                    name="option"
                    value={option}
                    checked={selectedOption === option}
                    onChange={handleOptionChange}
                  />
                  <label>{option}</label>
                </li>
              )
            )}
          </ul>
          {showFeedback && (
            <>
              <div className={`feedback ${feedback.toLowerCase()}`}>
                {feedback}
              </div>
              <br />
            </>
          )}
          {!showFeedback ? (
            <button onClick={handleSubmit} disabled={!selectedOption}>
              Submit
            </button>
          ) : currentQuestion < quizData.questions.length - 1 ? (
            <button onClick={handleNext}>Next</button>
          ) : (
            <>
              <div className="quiz-end">Quiz Completed!</div>
              <button onClick={() => router.push("/quiz")}>
                Back to Quiz List
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
