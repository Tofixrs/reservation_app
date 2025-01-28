import { Discord, GitHub, Google } from 'arctic';
import {
	DISCORD_CLIENT_ID,
	DISCORD_CLIENT_SECRET,
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	MAIL_USER,
	MAIL_SERVER,
	MAIL_PASSWORD,
	MAIL_SECURE_PORT
} from '$env/static/private';
import { createTransport } from 'nodemailer';

export const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, null);
export const discord = new Discord(
	DISCORD_CLIENT_ID,
	DISCORD_CLIENT_SECRET,
	'http://localhost:5173/auth/discord/callback'
);
export const google = new Google(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	'http://localhost:5173/auth/google/callback'
);

export const mailer = createTransport({
	host: MAIL_SERVER,
	port: Number(MAIL_SECURE_PORT),
	secure: true,
	auth: {
		user: MAIL_USER,
		pass: MAIL_PASSWORD
	}
});
