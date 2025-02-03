import { error, fail, redirect } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { emailVerification, sessions, users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { deleteSessionTokenCookie } from '$lib/server/session';
import { verify } from '@node-rs/argon2';
import { hashPassword } from '$lib/server/password';
import {
	createEmailVerificationRequest,
	deleteEmailVerificationRequestCookie,
	sendVerificationEmail,
	setEmailVerificationRequestCookie
} from '$lib/server/emailVerify';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user === null) {
		return redirect(303, '/auth/login');
	}
	if (!event.locals.user.emailVerified) return redirect(303, '/auth/verify-email');

	return { provider: event.locals.user.provider };
};

export const actions: Actions = {
	logout: async (event) => {
		if (event.locals.session == null) return fail(401);

		if (event.locals.user && !event.locals.user.emailVerified) {
			await db.delete(users).where(eq(users.id, event.locals.user.id));
			deleteSessionTokenCookie(event.cookies);
			return;
		}

		await db.delete(sessions).where(eq(sessions.id, event.locals.session.id));
		deleteSessionTokenCookie(event.cookies);

		return redirect(302, '/');
	},
	changePassword: async (event) => {
		if (event.locals.session == null) return fail(401);
		if (event.locals.user == null) return fail(401);

		const data = await event.request.formData();
		const currentPassword = data.get('currentPassword') as string;
		const currPassDb = await db.query.users.findFirst({
			columns: {
				password: true,
				provider: true
			},
			where: eq(users.id, event.locals.user.id)
		});

		if (!currPassDb) {
			return fail(500);
		}

		if (currPassDb.password != null && !verify(currPassDb.password, currentPassword)) {
			return fail(400, { invalidPass: true });
		}

		const password = data.get('password') as string;
		const hashedPassword = await hashPassword(password);

		await db
			.update(users)
			.set({
				password: hashedPassword
			})
			.where(eq(users.id, event.locals.user.id));

		return { sucess: true };
	},
	sendEmailChangeCode: async (event) => {
		if (event.locals.session == null) return fail(401);
		if (event.locals.user == null) return fail(401);
		const verificationId = event.cookies.get('email_change_verification');
		if (verificationId) {
			return { codeSent: true };
		}
		const formData = await event.request.formData();
		const passwordForm = formData.get('codePassword') as string;
		const user = await db.query.users.findFirst({
			where: eq(users.id, event.locals.user.id),
			columns: {
				password: true
			}
		});
		if (!user) {
			return error(500);
		}
		if (user?.password == null || !verify(user.password, passwordForm)) {
			return fail(400, { invalidPass: true });
		}

		const emailVerificationRequest = await createEmailVerificationRequest(event.locals.user.id);
		if (!emailVerificationRequest) {
			return error(500);
		}
		await sendVerificationEmail(event.locals.user.email, emailVerificationRequest.code);
		setEmailVerificationRequestCookie(event, emailVerificationRequest, 'email_change_verification');
		return { codeSent: true };
	},
	changeEmail: async (event) => {
		if (event.locals.session == null) return fail(401);
		if (event.locals.user == null) return fail(401);

		const verificationId = event.cookies.get('email_change_verification');
		if (!verificationId) {
			return fail(400, { expired: true });
		}
		const formData = await event.request.formData();

		const code = formData.get('changeEmailCode');
		const email = formData.get('newEmail') as string;

		const dbCode = await db.query.emailVerification.findFirst({
			where: eq(emailVerification.id, Number(verificationId))
		});

		if (!dbCode) {
			return fail(500, { codeSent: true });
		}

		if (dbCode.code != code) {
			return fail(400, { invalid: true });
		}

		await db.update(users).set({ email, emailVerified: false });
		await db.delete(emailVerification).where(eq(emailVerification.id, Number(verificationId)));
		deleteEmailVerificationRequestCookie(event);

		const emailVerificationRequest = await createEmailVerificationRequest(event.locals.user.id);
		if (!emailVerificationRequest) {
			return error(500);
		}
		await sendVerificationEmail(email, emailVerificationRequest.code);
		setEmailVerificationRequestCookie(event, emailVerificationRequest);
	}
};
