"use server";

import bcrypt from "bcryptjs";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmial } from "@/data/user";
import { db } from "@/lib/db";
import { NewPasswordSchema, NewPasswordSchemaType } from "@/schemas";

export async function newPassword(
  values: NewPasswordSchemaType,
  token: string | null,
) {
  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid password!" };
  }

  const { password } = validatedFields.data;

  if (!token) {
    return { error: "No token" };
  }

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exists" };
  }
  const expired = new Date(existingToken.expires) < new Date();
  if (expired) {
    return { error: "Token expired" };
  }

  const existingUser = await getUserByEmial(existingToken.email);

  if (!existingUser || !existingUser.id) {
    return { error: "User does not exists" };
  }
  const passwordHash = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      password: passwordHash,
    },
  });

  await db.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Password updated!" };
}
