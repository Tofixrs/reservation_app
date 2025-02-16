import { Provider } from '$lib/provider';
import { db } from './db';
import { users, type User } from './db/schema';

export async function createUser(
	provider: Provider,
	email: string,
	password?: string,
	OAuthId?: string,
	emailVerified?: boolean
) {
	try {
		const u = await db
			.insert(users)
			.values({ email, password, provider, OAuthId, emailVerified })
			.returning();

		const user: User = {
			email: email,
			id: u[0].id,
			OAuthId: OAuthId == undefined ? null : OAuthId,
			emailVerified: emailVerified ?? false,
			provider,
			admin: false
		};
		return user;
	} catch (e) {
		console.error(e);
		return null;
	}
}
