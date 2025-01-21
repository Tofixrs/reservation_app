import { Provider } from '../../provider';
import { relations, sql, type InferSelectModel } from 'drizzle-orm';
import {
    bigint,
	check,
	datetime,
	int,
	mysqlTable,
	timestamp,
	tinyint,
	varchar
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable(
	'users',
	{
		id: int('id').primaryKey().notNull().autoincrement(),
		email: varchar('email', { length: 255 }).notNull(),
		password: varchar('password', { length: 255 }),
		OAuthId:varchar("o_auth_id", {length: 255}),
		provider: tinyint('provider').notNull().$type<Provider>()
	},
	(t) => [
		{
			credentialsProvider: check(
				'credents_provider',
				sql`(${t.provider} == ${Provider.Credentials} AND ${t.password} IS NOT NULL AND ${t.OAuthId} IS NULL) OR (${t.provider} != ${Provider.Credentials}) AND ${t.OAuthId} IS NOT NULL AND $${t.password} IS NULL `
			)
		}
	]
);

export const usersRelations = relations(users, ({ many, one }) => ({
	reservations: many(reservations),
	session: one(sessions)
}));

export const rooms = mysqlTable('rooms', {
	id: int('id').primaryKey().notNull().autoincrement(),
	size: tinyint('size').notNull()
});

export const reservations = mysqlTable('reservations', {
	id: int('id').primaryKey().notNull().autoincrement(),
	userId: int('userId')
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),
	roomId: int('roomId')
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

export const sessions = mysqlTable('sessions', {
	id: varchar('id', { length: 255 }).notNull().primaryKey(),
	userId: int('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: datetime('expires_at', { mode: 'date' }).notNull()
});

export const sessionRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	})
}));

export type UserDB = InferSelectModel<typeof users>;
export type User = Omit<UserDB, 'password' | 'provider'>;

export type Session = InferSelectModel<typeof sessions>;
