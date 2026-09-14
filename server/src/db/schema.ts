import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable('users',{
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name',{
        length: 150,
    }).notNull(),
    email: varchar('email',{
        length: 255,
    }).notNull().unique(),
    password: text('password').notNull(),
    createdAt: timestamp('created_at',{
        withTimezone: true,
    }).defaultNow().notNull(),
});