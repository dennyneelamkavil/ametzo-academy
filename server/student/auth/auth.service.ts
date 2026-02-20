import "server-only";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { connectDB } from "@/server/db";
import { StudentModel } from "@/server/models/student.model";
import { OtpModel } from "@/server/models/otp.model";
import { AppError } from "@/server/errors/AppError";

import type {
  RequestOtpInput,
  VerifyOtpInput,
  CompleteProfileInput,
} from "./auth.validation";

const STUDENT_JWT_SECRET = process.env.STUDENT_JWT_SECRET!;

const OTP_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const OTP_MAX_REQUESTS = 5;
const OTP_COOLDOWN_MS = 30 * 1000; // 30 seconds

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function requestOtp(input: RequestOtpInput) {
  await connectDB();

  const now = new Date();

  let otpDoc = await OtpModel.findOne({
    destination: input.phone,
    type: "phone",
  });

  // ===== RATE LIMITING =====

  if (otpDoc) {
    const windowAge = now.getTime() - otpDoc.windowStart.getTime();

    // Reset window if expired
    if (windowAge > OTP_WINDOW_MS) {
      otpDoc.requestCount = 0;
      otpDoc.windowStart = now;
    }

    // Max requests check
    if (otpDoc.requestCount >= OTP_MAX_REQUESTS) {
      throw new AppError("Too many OTP requests. Try again later.", 429);
    }

    // Cooldown check
    const lastRequestAge = now.getTime() - otpDoc.updatedAt.getTime();

    if (lastRequestAge < OTP_COOLDOWN_MS) {
      throw new AppError("Please wait before requesting another OTP.", 429);
    }
  }

  // ===== GENERATE OTP =====
  // const otp = generateOtp();
  const otp = "123456"; // fixed OTP for testing, replace with generateOtp() in production
  const otpHash = await bcrypt.hash(otp, 10);

  otpDoc = await OtpModel.findOneAndUpdate(
    { destination: input.phone, type: "phone" },
    {
      otpHash,
      expiresAt: new Date(now.getTime() + 5 * 60 * 1000),
      verified: false,
      windowStart: otpDoc?.windowStart ?? now,
      requestCount: (otpDoc?.requestCount ?? 0) + 1,
    },
    { upsert: true, new: true },
  );

  // TODO: integrate SMS provider
  console.log("OTP:", otp);

  return { success: true };
}

export async function verifyOtp(input: VerifyOtpInput) {
  await connectDB();

  const otpDoc = await OtpModel.findOne({
    destination: input.phone,
    type: "phone",
  });

  if (!otpDoc || otpDoc.expiresAt < new Date()) {
    throw new AppError("OTP expired or invalid", 400);
  }

  const isValid = await bcrypt.compare(input.otp, otpDoc.otpHash);

  if (!isValid) {
    throw new AppError("Invalid OTP", 400);
  }

  // Delete OTP after success
  await otpDoc.deleteOne();

  let student = await StudentModel.findOne({
    phone: input.phone,
  });

  let isNewUser = false;

  if (!student) {
    student = await StudentModel.create({
      phone: input.phone,
    });

    isNewUser = true;
  }

  const token = jwt.sign(
    {
      sub: student._id.toString(),
      type: "student",
    },
    STUDENT_JWT_SECRET,
    { expiresIn: "7d" },
  );

  student.lastLoginAt = new Date();
  await student.save();

  return {
    token,
    isNewUser,
    student: {
      id: student._id.toString(),
      phone: student.phone,
      fullName: student.fullName,
    },
  };
}

export async function completeProfile(
  studentId: string,
  input: CompleteProfileInput,
) {
  await connectDB();

  const student = await StudentModel.findById(studentId);

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  student.fullName = input.fullName;
  if (input.email) student.email = input.email;

  await student.save();

  return {
    student: {
      id: student._id.toString(),
      phone: student.phone,
      fullName: student.fullName,
      email: student.email,
    },
  };
}
