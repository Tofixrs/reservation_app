import { Provider } from '$lib/provider';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/session';
import { verify } from '@node-rs/argon2';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const actions = {
	login: async (event) => {
		const data = await event.request.formData();
		const email = data.get('email') as string;
		const password = data.get('password') as string;

		const user = await db.query.users.findFirst({
			where: eq(users.email, email)
		});
		if (user == undefined) return fail(400, { wrongCredentials: true });
		if (!(await verify(user.password!, password))) return fail(400, { wrongCredentials: true });

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, user.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, '/');
	}
} satisfies Actions;
