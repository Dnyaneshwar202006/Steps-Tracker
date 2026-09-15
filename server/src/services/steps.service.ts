import { and, eq, desc } from "drizzle-orm";
import db from "../db/db";
import { steps } from "../db/schema";

export const saveSteps = async (
  userId: string,
  date: string,
  stepCount: number,
) => {
  const [existing] = await db
    .select()
    .from(steps)
    .where(and(eq(steps.userId, userId), eq(steps.date, date)));
  if (existing) {
    const [updated] = await db
      .update(steps)
      .set({
        steps: stepCount,
      })
      .where(eq(steps.id, existing.id))
      .returning();

    return updated;
  }

  const [created] = await db
    .insert(steps)
    .values({
      userId,
      date,
      steps: stepCount,
    })
    .returning();

  return created;
};

export const getStepsByDate = async (userId: string, date: string) => {
  const [result] = await db
    .select()
    .from(steps)
    .where(and(eq(steps.userId, userId), eq(steps.date, date)));

  return result;
};

export const getHistory = async (userId: string) => {
  const result = await db
    .select()
    .from(steps)
    .where(eq(steps.userId, userId))
    .orderBy(desc(steps.date))
    .limit(20);

  return result;
};
