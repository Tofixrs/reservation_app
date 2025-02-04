import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from './db';
import { sessions, users, type Session, type User } from './db/schema';
import { eq } from 'drizzle-orm';
import type { Cookies, RequestEvent } from '@sveltejs/kit';

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const [row] = await db
		.select({
			userID: users.id,
			sessionID: sessions.id,
			sessionExpire: sessions.expiresAt,
			email: users.email,
			emailVerified: users.emailVerified,
			provider: users.provider,
			OAuthId: users.OAuthId,
			admin: users.admin
		})
		.from(sessions)
		.leftJoin(users, eq(sessions.userId, users.id))
		.where(eq(sessions.id, sessionId))
		.limit(1);

	if (!row) {
		return { session: null, user: null };
	}

	const session: Session = {
		id: row.sessionID,
		userId: row.userID!,
		expiresAt: row.sessionExpire
	};

	const user: User = {
		id: row.userID!,
		email: row.email!,
		OAuthId: row.OAuthId!,
		emailVerified: row.emailVerified!,
		provider: row.provider!,
		admin: row.admin ?? false
	};

	if (Date.now() >= session.expiresAt.getTime()) {
		db.delete(sessions).where(eq(sessions.id, sessionId));
		return { session: null, user: null };
	}
	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		db.update(sessions).set({
			expiresAt: new Date(session.expiresAt.getTime() / 1000)
		});
	}
	return { session, user };
}

export function generateSessionToken(): string {
	const tokenBytes = new Uint8Array(20);
	crypto.getRandomValues(tokenBytes);
	const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
	return token;
}

export async function createSession(token: string, user: number) {
	const sesionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const session = {
		userId: user,
		id: sesionId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
	};

	await db.insert(sessions).values(session);

	return session;
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set('session', token, {
		httpOnly: true,
		path: '/',
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		expires: expiresAt
	});
}

export function deleteSessionTokenCookie(cookies: Cookies): void {
	cookies.set('session', '', {
		httpOnly: true,
		path: '/',
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		maxAge: 0
	});
}
