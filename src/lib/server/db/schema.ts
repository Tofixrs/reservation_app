import {
	pgTable,
	varchar,
	smallint,
	boolean,
	char,
	timestamp,
	serial,
	text
} from 'drizzle-orm/pg-core';
import { Provider } from '../../provider';
import { relations, type InferSelectModel } from 'drizzle-orm';

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	email: varchar('email', { length: 255 }).notNull(),
	password: varchar('password', { length: 255 }),
	OAuthId: varchar('o_auth_id', { length: 255 }),
	provider: smallint('provider').notNull().$type<Provider>(),
	emailVerified: boolean('email_verified').notNull().default(false),
	admin: boolean('admin').notNull().default(false),
	changingEmail: boolean('changing_email').notNull().default(false)
});

export const usersRelations = relations(users, ({ many, one }) => ({
	reservations: many(reservations),
	session: one(sessions)
}));

export const rooms = pgTable('rooms', {
	id: serial('id').primaryKey(),
	size: smallint('size').notNull(),
	description: text('description').notNull(),
	name: varchar('name', { length: 50 }).notNull()
});

export const roomRelations = relations(rooms, ({ many }) => ({
	roomImageKeys: many(roomImageKeys)
}));

export const roomImageKeys = pgTable('room_image_keys', {
	imageKey: text('image_key').notNull(),
	roomID: serial('roomID')
		.notNull()
		.references(() => rooms.id, { onDelete: 'cascade' })
});

export const roomImageKeyRelations = relations(roomImageKeys, ({ one }) => ({
	room: one(rooms, {
		fields: [roomImageKeys.roomID],
		references: [rooms.id]
	})
}));

export const reservations = pgTable('reservations', {
	id: serial('id').primaryKey(),
	userId: serial('userId')
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),
	roomId: serial('roomId')
		.references(() => rooms.id, { onDelete: 'cascade' })
		.notNull(),
	timeOfArrival: timestamp('time_of_arrival').notNull(),
	timeOfLeave: timestamp('time_of_leave').notNull()
});

export const reservationsRelations = relations(reservations, ({ one }) => ({
	user: one(users, {
		fields: [reservations.userId],
		references: [users.id]
	}),
	room: one(rooms, {
		fields: [reservations.roomId],
		references: [rooms.id]
	})
}));

export const sessions = pgTable('sessions', {
	id: varchar('id', { length: 255 }).notNull().primaryKey(),
	userId: serial('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { mode: 'date' }).notNull()
});

export const sessionRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	})
}));

export const emailVerification = pgTable('email_verification', {
	id: serial('id').primaryKey(),
	userId: serial('userId')
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),
	code: char('code', { length: 8 }).notNull(),
	expiresAt: timestamp('expires_at').notNull()
});

export const emailVerificationRelations = relations(emailVerification, ({ one }) => ({
	user: one(users, {
		fields: [emailVerification.userId],
		references: [users.id]
	})
}));

export type UserDB = InferSelectModel<typeof users>;
export type User = Omit<UserDB, 'password'>;

export type Session = InferSelectModel<typeof sessions>;
export type EmailVerification = InferSelectModel<typeof emailVerification>;
