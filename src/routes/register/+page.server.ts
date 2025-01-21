import { Provider } from '$lib/provider';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { hashPassword } from '$lib/server/password';
import { createUser } from '$lib/server/user';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const actions = {
	register: async (event) => {
		const data = await event.request.formData();
		const email = data.get('email') as string;
		const password = data.get('password') as string;

		const exists = await db.query.users.findFirst({
			columns: {
				email: true
			},
			where: eq(users.email, email)
		});
		if (exists != undefined) return fail(400, { alreadyExists: true });

		await createUser(Provider.Credentials, email, await hashPassword(password));

		return redirect(302, '/login');
	}
} satisfies Actions;
