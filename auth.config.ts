import type { NextAuthConfig } from "next-auth";
import credentials from "next-auth/providers/credentials";
import github from "next-auth/providers/github";
import google from "next-auth/providers/google";

import bcrypt from "bcryptjs";

import { LoginSchema } from "./schemas";
import { getUserByEmial } from "./data/user";

export default {
  providers: [
    github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;

        const user = await getUserByEmial(email);
        if (!user || !user.password) {
          //user without the password can exisits because we have providers like gihub and google
          return null;
        }

        //Now user exits we want to check if the users password is same as password in the form
        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
          return null;
        }

        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
