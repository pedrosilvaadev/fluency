import "server-only";

import { cache } from "react";

import { requireAuth } from "@/lib/auth";
import { toUserDTO } from "@/lib/dto/user";
import { prisma } from "@/lib/prisma";

export const getCurrentUser = cache(async () => {
  const authUser = await requireAuth();
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: authUser.id },
  });
  return toUserDTO(user);
});

export async function getUserById(id: string) {
  const authUser = await requireAuth();
  if (authUser.id !== id) return null;

  const user = await prisma.user.findUnique({ where: { id } });
  return user ? toUserDTO(user) : null;
}
