//We need to this because when in dev every next.js server refresh create new connection with database
//we can support limited number of connection so after a point
//the connection will not me made

import { PrismaClient } from "@prisma/client";

//gobal is not affected by hot reload
declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
