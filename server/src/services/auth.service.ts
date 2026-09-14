import { eq } from "drizzle-orm";
import db from "../db/db";
import { users } from "../db/schema";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const doesUserExist = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (doesUserExist.length > 0) {
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [user] = await db
    .insert(users)
    .values({
      name,
      email,
      password: passwordHash,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      created_at: users.createdAt,
    });

  if (!user) {
    throw new Error("Failed to create the user..");
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    },
  );

  return {
    user,
    token,
  };
};

export const loginUser = async (email: string, password: string) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    throw new Error("Invalid Email or Password");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new Error("Invalid Email or Password");
  }

  const token = jwt.sign(
    {
      id: user.email,
      email: user.email,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    },
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    },
    token,
  };
};
