import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import client from "@/lib/mongodb";
import nodemailer from "nodemailer";

export async function POST(req) {
  const body = await req.json();

  await client.connect();
  const db = client.db("FrozenBeats");
  const Users  = db.collection("users");
  const Otp  = db.collection("otp");
  
  const { username, email, password } = body;

  const entry = await Users.findOne({ email: email });

  if(entry != null){
    return Response.json({ error: "Email already registered" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const result = await Otp.insertOne({
    username,
    otp,
    email,
    password: hashedPassword,
  });

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
    html: `<p>Your OTP is <strong>${otp}</strong></p>`
});

  return Response.json(result);
}

