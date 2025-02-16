import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from './db';
import { sessions, users, type Session, type User } from './db/schema';
import { eq } from 'drizzle-orm';
import type { Cookies, RequestEvent } from '@sveltejs/kit';

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const sessionDB = await db.query.sessions.findFirst({
		with: {
			user: true
		},
		where: eq(sessions.id, sessionId)
	});

	if (!sessionDB) {
		return { session: null, user: null };
	}

	const session: Session = {
		id: sessionDB.id,
		userId: sessionDB.userId,
		expiresAt: sessionDB.expiresAt
	};

	const user: User = {
		id: sessionDB.user.id!,
		email: sessionDB.user.email!,
		OAuthId: sessionDB.user.OAuthId!,
		emailVerified: sessionDB.user.emailVerified!,
		provider: sessionDB.user.provider!,
		admin: sessionDB.user.admin ?? false,
		changingEmail: sessionDB.user.changingEmail
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
