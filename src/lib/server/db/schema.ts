import {
	pgTable,
	varchar,
	smallint,
	boolean,
	char,
	timestamp,
	serial,
	text,
	real,
	check
} from 'drizzle-orm/pg-core';
import { Provider } from '../../provider';
import { gt, relations, type InferSelectModel } from 'drizzle-orm';

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

export const roomTypes = pgTable(
	'room_types',
	{
		id: serial('id').primaryKey(),
		size: smallint('size').notNull(),
		description: text('description').notNull(),
		name: varchar('name', { length: 50 }).notNull(),
		pricePerDay: real('price_per_day').notNull()
	},
	(table) => [
		{
			price_check: check('price_checl', gt(table.pricePerDay, 0))
		}
	]
);

export const roomTypeRelations = relations(roomTypes, ({ many }) => ({
	roomImageKeys: many(roomImageKeys),
	rooms: many(rooms)
}));

export const rooms = pgTable('rooms', {
	id: serial('id').primaryKey(),
	roomTypeId: serial('room_type_id')
		.notNull()
		.references(() => roomTypes.id, { onDelete: 'cascade' })
});

export const roomRelations = relations(rooms, ({ one, many }) => ({
	roomTypes: one(roomTypes, {
		fields: [rooms.roomTypeId],
		references: [roomTypes.id]
	}),
	reservationRooms: many(reservationRooms)
}));

export const roomImageKeys = pgTable('room_image_keys', {
	imageKey: text('image_key').notNull(),
	roomTypeId: serial('roomTypeId')
		.notNull()
		.references(() => roomTypes.id, { onDelete: 'cascade' })
});

export const roomImageKeyRelations = relations(roomImageKeys, ({ one }) => ({
	roomType: one(roomTypes, {
		fields: [roomImageKeys.roomTypeId],
		references: [roomTypes.id]
	})
}));

export const reservations = pgTable('reservations', {
	id: serial('id').primaryKey(),
	userId: serial('user_id')
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),
	timeOfArrival: timestamp('time_of_arrival').notNull(),
	timeOfLeave: timestamp('time_of_leave').notNull()
});

export const reservationRooms = pgTable('reservation_rooms', {
	reservationID: serial('rerservation_id').references(() => reservations.id, {
		onDelete: 'cascade'
	}),
	roomId: serial('room_id')
		.references(() => rooms.id, { onDelete: 'cascade' })
		.unique()
});

export const reservationRoomsRelations = relations(reservationRooms, ({ one }) => ({
	reservation: one(reservations, {
		fields: [reservationRooms.reservationID],
		references: [reservations.id]
	}),
	rooms: one(rooms, {
		fields: [reservationRooms.roomId],
		references: [rooms.id]
	})
}));

export const reservationsRelations = relations(reservations, ({ one, many }) => ({
	user: one(users, {
		fields: [reservations.userId],
		references: [users.id]
	}),
	reservationRooms: many(reservationRooms)
}));

export const sessions = pgTable('sessions', {
	id: varchar('id', { length: 255 }).notNull().primaryKey(),
	userId: serial('user_id')
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
	userId: serial('user_id')
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
export type Room = InferSelectModel<typeof rooms>;
export type RoomType = InferSelectModel<typeof roomTypes>;
export type RoomWithInfo = Room & { roomTypes: RoomType };
