import { NextResponse } from "next/server";
import { Course } from "@/models/Course";
import { User } from "@/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  await connectDB();
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

    const existedCourse = await Course.findOne({ $or: [{ name }, { code }] });
    if (existedCourse) {
      return NextResponse.json(
        { message: "Course with this name or code already exists" },
        { status: 409 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const course = await Course.create({ name, code, creditHours, userId });

    return NextResponse.json(
      { message: "Course created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: error.statusCode || 500 }
    );
  }
}

export async function GET() {
  await connectDB();
  try {
    const courses = await Course.find().populate("userId", "-password");
    return NextResponse.json(
      { courses, message: "Courses retrieved successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      {
        status: 500,
      }
    );
  }
}
