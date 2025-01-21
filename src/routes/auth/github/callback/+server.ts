import { generateSessionToken, createSession, setSessionTokenCookie } from '$lib/server/session';
import { github } from '$lib/server/oauth';

import { error, type RequestEvent } from '@sveltejs/kit';
import type { OAuth2Tokens } from 'arctic';
import { db } from '$lib/server/db';
import { and, eq, or } from 'drizzle-orm';
import { users } from '$lib/server/db/schema';
import { Provider } from '$lib/provider';
import { createUser } from '$lib/server/user';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('github_oauth_state') ?? null;
	if (code === null || state === null || storedState === null) {
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
		tokens = await github.validateAuthorizationCode(code);
	} catch (e) {
		// Invalid code or client credentials
		return new Response(null, {
			status: 400
		});
	}
	const githubUserResponse = await fetch('https://api.github.com/user', {
		headers: {
			Authorization: `Bearer ${tokens.accessToken()}`
		}
	});
	const githubUser = await githubUserResponse.json();
	const githubUserId = githubUser.id as number;

	const res = await fetch('https://api.github.com/user/emails', {
		headers: { Authorization: `token ${tokens.accessToken()}` }
	});
	const emails: { primary: number; email: string }[] = await res.json();
	const email = emails.sort((a, b) => b.primary - a.primary)[0].email;

	const existingUser = await db.query.users.findFirst({
		where: or(
			and(eq(users.provider, Provider.Github), eq(users.OAuthId, githubUserId)),
			eq(users.email, email)
		)
	});

	if (existingUser?.provider != Provider.Github && existingUser != null)
		error(400, 'Account with this email already exists');

	if (existingUser) {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	}

	const user = await createUser(Provider.Github, email, undefined, githubUserId);

	if (!user) return error(500);

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	setSessionTokenCookie(event, sessionToken, session.expiresAt);

	return new Response(null, {
		status: 302,
		headers: {
			Location: '/'
		}
	});
}
