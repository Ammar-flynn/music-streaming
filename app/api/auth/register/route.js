export const runtime = "nodejs";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import client from "@/lib/mongodb";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Received registration request:", { ...body, password: "***" });

    await client.connect();
    const db = client.db("FrozenBeats");
    const Users = db.collection("users");
    const Otp = db.collection("otp");
    
    const { username, email, password } = body;

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await Users.findOne({ email: email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Generated OTP for ${email}: ${otp}`);

    // Store OTP in database
    const result = await Otp.insertOne({
      username,
      otp,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    // Send email with OTP
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: "Your FrozenBeats OTP",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #0A74DA;">Welcome to Frozen Beats! ❄️</h2>
            <p>Your OTP for email verification is:</p>
            <div style="font-size: 32px; font-weight: bold; color: #0A74DA; padding: 20px; text-align: center; background: #f0f0f0; border-radius: 8px; letter-spacing: 4px;">
              ${otp}
            </div>
            <p>This OTP will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <hr />
            <p style="color: #666; font-size: 12px;">Frozen Beats - Your Music Streaming Platform</p>
          </div>
        `
      });
      
      console.log(`OTP email sent to ${email}`);
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
    }

    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: "OTP sent to your email",
      email: email 
    }, { status: 200 });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}