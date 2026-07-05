import type { User } from "@/generated/prisma/client";

export type UserDTO = Readonly<{
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  xp: number;
  level: number;
  streak: number;
  timeZone: string;
}>;

export function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    xp: user.xp,
    level: user.level,
    streak: user.streak,
    timeZone: user.timeZone,
  };
}
