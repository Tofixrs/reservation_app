import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (ev) => {
	const roomsWithImages = await db.query.rooms.findMany({
		with: {
			roomImageKeys: true
		}
	});
	return { rooms: roomsWithImages };
};
