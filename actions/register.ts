"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

import { getUserByEmial } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";

import { RegisterSchema, RegisterSchemaType } from "@/schemas";
import { sendVerificationEmail } from "@/lib/mail";
export async function register(values: RegisterSchemaType) {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, name, password } = validatedFields.data;

  const passwordHash = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmial(email);

  if (existingUser) {
    return { error: "Email already in use" };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: passwordHash,
    },
  });

  //TODO: send verification token email
  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Confirmation Email sent!" };
}
