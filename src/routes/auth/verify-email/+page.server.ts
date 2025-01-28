import { db } from '$lib/server/db';
import { emailVerification, users } from '$lib/server/db/schema';
import {
	createEmailVerificationRequest,
	deleteEmailVerificationRequestCookie,
	sendVerificationEmail,
	setEmailVerificationRequestCookie
} from '$lib/server/emailVerify';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const actions: Actions = {
	verifyEmail: async (event) => {
		if (event.locals.user === null) {
			return redirect(303, '/auth/login');
		}
		if (event.locals.user.emailVerified) {
			return redirect(303, '/');
		}
		const data = await event.request.formData();
		const code = data.get('verificationCode');
		const verificationId = event.cookies.get('email_verification');

		if (!verificationId) {
			const emailVerificationRequest = await createEmailVerificationRequest(event.locals.user.id);
			if (!emailVerificationRequest) {
				return error(500);
			}
			await sendVerificationEmail(event.locals.user.email, emailVerificationRequest.code);
			setEmailVerificationRequestCookie(event, emailVerificationRequest);
			return fail(400, { expired: true });
		}

		const emailVerificationData = await db.query.emailVerification.findFirst({
			where: eq(emailVerification.id, Number(verificationId))
		});

		if (!emailVerificationData || Date.now() >= emailVerificationData.expiresAt.getTime()) {
			const emailVerificationRequest = await createEmailVerificationRequest(event.locals.user.id);
			if (!emailVerificationRequest) {
				return error(500);
			}
			await sendVerificationEmail(event.locals.user.email, emailVerificationRequest.code);
			setEmailVerificationRequestCookie(event, emailVerificationRequest);
			return fail(400, { expired: true });
		}
		if (code != emailVerificationData.code) {
			return fail(400, { invalid: true });
		}

		await db.update(users).set({ emailVerified: true });
		await db.delete(emailVerification).where(eq(emailVerification.id, Number(verificationId)))
		deleteEmailVerificationRequestCookie(event);

		redirect(303, '/');
	}
};
