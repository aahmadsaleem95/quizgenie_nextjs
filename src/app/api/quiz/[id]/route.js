// src/app/api/quiz/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // Your MongoDB connection function
import { Quiz } from "@/models/Quiz"; // Your Mongoose model

// GET: Get quiz by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: quiz,
      message: "Quiz retrieved successfully.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching quiz" },
      { status: 500 }
    );
  }
}

// PUT: Update quiz by ID
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const updatedQuiz = await Quiz.findByIdAndUpdate(id, body, { new: true });

    if (!updatedQuiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json({
      updatedQuiz,
      message: "Quiz updated successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error updating quiz" },
      { status: 500 }
    );
  }
}

// DELETE: Remove quiz by ID
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const deletedQuiz = await Quiz.findByIdAndDelete(id);

    if (!deletedQuiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error deleting quiz" },
      { status: 500 }
    );
  }
}
