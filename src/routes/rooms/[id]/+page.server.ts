import { db } from '$lib/server/db';
import { rooms } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const room = await db.query.roomTypes.findFirst({
		where: eq(rooms.id, Number(event.params.id)),
		with: {
			roomImageKeys: true
		}
	});
	if (room) {
		return { room };
	}
	error(404, 'Not found');
};
