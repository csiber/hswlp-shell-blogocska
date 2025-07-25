import { getDB } from "@/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserDisplayName(userId: string): Promise<string> {
  const db = getDB();
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.id, userId),
    columns: {
      nickname: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  });

  if (!user) return userId;

  return (
    user.nickname ||
    (user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.email || userId)
  );
}
