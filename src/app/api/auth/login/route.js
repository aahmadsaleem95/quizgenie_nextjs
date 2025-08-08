// src/app/api/auth/login/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { User } from "@/models/User";
import { connectDB } from "@/lib/db";

export async function POST(request) {
  await connectDB();
  const { username: email, password } = await request.json();
  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordCorrect(password))) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  // Create JWT
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Set cookie
  const _cookies = await cookies();
  _cookies.set("user", token, {
    httpOnly: true,
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  // Remove sensitive fields
  const { password: _, ...userData } = user.toObject();

  return NextResponse.json({ message: "Login successful", user: userData });
}
