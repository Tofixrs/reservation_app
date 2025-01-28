import { encodeBase32UpperCaseNoPadding } from '@oslojs/encoding';
import type { RequestEvent } from '@sveltejs/kit';
import { emailVerification, type EmailVerification } from './db/schema';
import { db } from './db';
import { eq } from 'drizzle-orm';
import { mailer } from './oauth';

function generateCode() {
	const bytes = new Uint8Array(5);
	crypto.getRandomValues(bytes);
	const code = encodeBase32UpperCaseNoPadding(bytes);
	return code;
}

export async function createEmailVerificationRequest(
	userId: number
): Promise<EmailVerification | null> {
	await db.delete(emailVerification).where(eq(emailVerification.userId, userId));

	const code = generateCode();
	const expiresAt = new Date(Date.now() + 1000 * 60 * 10);
	const id = await db
		.insert(emailVerification)
		.values({
			userId,
			expiresAt,
			code
		})
		.$returningId();

	if (!id) {
		return null;
	}

	const request: EmailVerification = {
		id: id[0].id,
		userId,
		code,
		expiresAt
	};
	return request;
}

export async function sendVerificationEmail(email: string, code: string) {
	return mailer.sendMail({
		subject: 'Verication code for reservation app',
		to: email,
		html: `<p>Your verification code is</p><h1>${code}</h1>`
	});
}

export function setEmailVerificationRequestCookie(
	event: RequestEvent,
	request: EmailVerification,
	name: string = 'email_verification'
): void {
	event.cookies.set(name, request.id.toString(), {
		httpOnly: true,
		path: '/',
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		expires: request.expiresAt
	});
}

export function deleteEmailVerificationRequestCookie(
	event: RequestEvent,
	name: string = 'email_verification'
): void {
	event.cookies.delete(name, {
		httpOnly: true,
		path: '/',
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		maxAge: 0
	});
}
