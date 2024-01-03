import { UserType } from "@/types";
import { connectDB } from "../database/mongoose";
import User from "../model/user.model";
import { Session } from "../model/session.model";

// User Actions
export async function saveUsers(users: UserType) {
  if (!users) return;
  let newUser;
  try {
    await connectDB(); // Connect to the database

    const existingUser = await User.findOne({ _id: users._id });

    if (existingUser) {
      console.log("User exists", existingUser);
      // Handle existing user logic (e.g., redirect)
    } else {
      // Create a new user
      newUser = new User({
        username: users.name,
        email: users.email,
        passwordHash: users.password,
        phoneNumber: users.phoneNumber,
      });

      // Save the user to the database
      await newUser.save();
      console.log("User created successfully");
    }

    return newUser;
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function loginUser(credentials: {
  email: string;
  password: string;
}) {
  try {
    await connectDB();

    const user = await User.findOne({ email: credentials.email });
    if (!user) return null;

    // Create a session entry in the database if login is successful
    if (user) {
      const expirationTime = new Date(Date.now() + 60 * 60 * 1000); // 1-hour expiration

      // Save the session information in the database
      await Session.create({
        userId: user._id,
        expirationTime,
      });
    }

    // Return the user if login is successful
    return user;
  } catch (error: any) {
    throw new Error(`Failed to login user: ${error.message}`);
  }
}

export async function clearExpiredSessions() {
  const currentTimestamp = new Date();
  await Session.deleteMany({ expirationTime: { $lt: currentTimestamp } });
}
