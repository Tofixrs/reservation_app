import { generateCodeVerifier, generateState } from 'arctic';
import type { RequestEvent } from './$types';
import { discord } from '$lib/server/oauth';

export async function GET(event: RequestEvent): Promise<Response> {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const url = discord.createAuthorizationURL(state, codeVerifier, ['email', 'identify']);

	event.cookies.set('discord_oauth_state', state, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});
	event.cookies.set('discord_code_verifier', codeVerifier, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	return new Response(null, { status: 302, headers: { Location: url.toString() } });
}
