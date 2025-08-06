import { NextResponse } from "next/server";
import { Course } from "@/models/Course";
import { User } from "@/models/User";
import { Quiz } from "@/models/Quiz";
import { connectDB } from "@/lib/db";

export async function GET(req, { params }) {
  await connectDB();
  const { id } = await params;

  try {
    const course = await Course.findById(id).populate("userId", "-password");
    if (!course) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: course, message: "Course retrieved successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: error.statusCode || 500 }
    );
  }
}

export async function PUT(req, { params }) {
  await connectDB();
  const { id } = await params;
  try {
    const body = await req.json();
    const { name, code, creditHours, userId } = body;

    if ([name, code, userId].some((field) => field?.trim() === "")) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(creditHours) || creditHours <= 0) {
      return NextResponse.json(
        { message: "Credit hours must be a positive integer" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { name, code, creditHours, userId },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { updatedCourse, message: "Course updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: error.statusCode || 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = await params;

  try {
    await Quiz.deleteMany({ courseId: id });
    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Course deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: error.statusCode || 500 }
    );
  }
}
