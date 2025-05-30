// src/hooks.server.ts
import {
	validateSessionToken,
	setSessionTokenCookie,
	deleteSessionTokenCookie
} from './lib/server/session';
import { locale } from 'svelte-i18n';

import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session') ?? null;
	if (token === null) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await validateSessionToken(token);
	if (session !== null) {
		setSessionTokenCookie(event, token, session.expiresAt);
	} else {
		deleteSessionTokenCookie(event.cookies);
	}

	event.locals.session = session;
	event.locals.user = user;
	const lang = event.request.headers.get('accept-language')?.split(',')[0];
	if (lang) {
		locale.set(lang);
	}
	return resolve(event);
};
