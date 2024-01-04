"use server";
import { UserType } from "@/types";
import { connectDB } from "../database/mongoose";
import User from "../model/user.model";
import Session from "../model/session.model";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// User Actions
export async function saveUsers(users: UserType) {
  if (!users) return;
  let newUser;
  try {
    await connectDB();

    const existingUser = await User.findOne({ _id: users._id });

    if (existingUser) {
      console.log("User exists", existingUser);
      // Handle existing user logic (e.g., redirect)
      return new NextResponse("Email is in use, choose another one", {
        status: 400,
      });
    } else {
      // Create a new user
      const hashedPassword = await bcrypt.hash(users.password, 5);
      newUser = new User({
        username: users.name,
        email: users.email,
        password: hashedPassword,
        phoneNumber: users.phoneNumber,
      });

      // Save the user to the database
      await newUser.save();
      console.log("User created successfully");
    }
    // new NextResponse("User is registered", { status: 200 }),
    return newUser;
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}
