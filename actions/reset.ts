"use server";

import { ResetSchema, ResetSchemaType } from "@/schemas";
import { getUserByEmial } from "@/data/user";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";

export async function reset(values: ResetSchemaType) {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmial(email);

  if (!existingUser) {
    return { error: "Email not found" };
  }

  const resetPasswordToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    resetPasswordToken.email,
    resetPasswordToken.token,
  );
  return { success: "Reset email sent!" };
}
