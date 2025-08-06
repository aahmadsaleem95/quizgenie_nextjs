import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Quiz } from "@/models/Quiz";
import { Course } from "@/models/Course";

// GET: List all quizzes
export async function GET() {
  await connectDB();
  try {
    const quizzes = await Quiz.find().populate("courseId");
    return NextResponse.json(
      { quizzes, message: "Quizzes retrieved successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST: Create a new quiz
export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const { name, totalQuestion, marks, courseId, questionsJson } = body;

    if ([name, courseId].some((field) => !field?.trim())) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(totalQuestion) || totalQuestion <= 0) {
      return NextResponse.json(
        { message: "Total questions must be a positive integer" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(marks) || marks <= 0) {
      return NextResponse.json(
        { message: "Marks must be a positive integer" },
        { status: 400 }
      );
    }

    if (typeof questionsJson !== "object" || questionsJson === null) {
      return NextResponse.json(
        { message: "questionsJson must be a valid JSON object" },
        { status: 400 }
      );
    }

    const existedQuiz = await Quiz.findOne({ name, courseId });
    if (existedQuiz) {
      return NextResponse.json(
        { message: "Quiz with this name already exists" },
        { status: 409 }
      );
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }

    const quiz = await Quiz.create({
      name,
      totalQuestion,
      marks,
      questionsJson,
      courseId,
    });

    return NextResponse.json(
      { data: quiz, message: "Quiz created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: error.statusCode || 500 }
    );
  }
}
