import { decodeIdToken, type OAuth2Tokens } from 'arctic';
import type { RequestEvent } from './$types';
import { google } from '$lib/server/oauth';
import { db } from '$lib/server/db';
import { and, eq, or } from 'drizzle-orm';
import { users } from '$lib/server/db/schema';
import { Provider } from '$lib/provider';
import { error } from '@sveltejs/kit';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/session';
import { createUser } from '$lib/server/user';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('google_oauth_state') ?? null;
	const codeVerifier = event.cookies.get('google_code_verifier') ?? null;
	const after = event.cookies.get('after_login') ?? '';
	if (code === null || state === null || storedState === null || codeVerifier == null) {
		return new Response(null, {
			status: 400
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch (e) {
		// Invalid code or client credentials
		return new Response(null, {
			status: 400
		});
	}

	const claims: any = decodeIdToken(tokens.idToken());
	const googleUserId = claims.sub;
	const email = claims.email;

	const existingUser = await db.query.users.findFirst({
		where: or(
			and(eq(users.provider, Provider.Google), eq(users.OAuthId, googleUserId)),
			eq(users.email, email)
		)
	});

	if (existingUser?.provider != Provider.Google && existingUser != null)
		return error(400, 'Account with this email already exists');

	if (existingUser) {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: after == '' ? '/' : after
			}
		});
	}

	const user = await createUser(Provider.Google, email, undefined, googleUserId, true);

	if (!user) return error(500, 'Couldnt create user');

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	setSessionTokenCookie(event, sessionToken, session.expiresAt);

	return new Response(null, {
		status: 302,
		headers: {
			Location: after == '' ? '/' : after
		}
	});
}
