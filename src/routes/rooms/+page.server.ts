import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../account/$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user === null) {
		return redirect(303, '/auth/login');
	}
	if (!event.locals.user.emailVerified) return redirect(303, '/auth/verify-email');

	const rooms = await db.query.rooms.findMany();
	return { rooms };
};
