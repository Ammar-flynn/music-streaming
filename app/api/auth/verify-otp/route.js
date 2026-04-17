export const runtime = "nodejs";

import { NextResponse } from "next/server";
import client from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Verify OTP request:", body);

    await client.connect();
    const db = client.db("FrozenBeats");
    const Otp = db.collection("otp");
    const Users = db.collection("users");

    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Find the OTP entry
    const entry = await Otp.findOne({ 
      email: email, 
      otp: otp 
    });
    
    if (!entry) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    // Check if OTP expired
    if (entry.expiresAt && new Date() > new Date(entry.expiresAt)) {
      await Otp.deleteOne({ _id: entry._id });
      return NextResponse.json(
        { error: "OTP has expired. Please register again." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await Users.findOne({ email: email });
    if (existingUser) {
      await Otp.deleteOne({ _id: entry._id });
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 400 }
      );
    }

    // Create the user
    const result = await Users.insertOne({
      username: entry.username,
      email: entry.email,
      password: entry.password,
      role: "user",
      createdAt: new Date(),
      isVerified: true
    });

    // Delete the OTP
    await Otp.deleteOne({ _id: entry._id });

    console.log(`User created successfully: ${email}`);

    return NextResponse.json({ 
      success: true, 
      message: "Account created successfully",
      userId: result.insertedId
    }, { status: 200 });

  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}