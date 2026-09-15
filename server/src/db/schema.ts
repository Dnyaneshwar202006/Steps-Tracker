import { pgTable, uuid, varchar, text, timestamp, date, integer } from "drizzle-orm/pg-core";

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

export const steps = pgTable('steps',{
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id),
    date: date('date').notNull(),
    steps: integer('steps').notNull(),
    createdAt: timestamp('created_at',{
        withTimezone: true,
    }).defaultNow().notNull(),
})