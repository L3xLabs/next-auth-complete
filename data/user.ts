import { db } from "@/lib/db";
import { User } from "@prisma/client";

export const getUserByEmial = async (email: string) => {
  const user = await db.user.findUnique({
    where: { email: email },
  });

  return user;
};

export const getUserById = async (id: string): Promise<User | null> => {
  const user = await db.user.findUnique({
    where: { id: id },
  });

  return user;
};
