import { connectDB } from "@/lib/db"; // Your DB connection utility
import { Quiz } from "@/models/Quiz"; // Your Mongoose Quiz model
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const quizzes = await Quiz.find({ courseId: id }).populate("courseId");

    return NextResponse.json(
      {
        quizzes,
        message: "Quizzes retrieved successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { status: 500, message: "Server Error" },
      { status: 500 }
    );
  }
}
