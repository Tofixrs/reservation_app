import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { inArray } from 'drizzle-orm';
import { rooms as roomsTable } from '$lib/server/db/schema';
export const load: PageServerLoad = async (ev) => {
	const { searchParams } = ev.url;
	const tommorow = new Date();
	tommorow.setDate(tommorow.getDate() + 1);
	tommorow.setHours(0, 0, 0, 0);

	const from = new Date(searchParams.get('from') ?? 0);
	const until = new Date(searchParams.get('until') ?? 0);
	if (until < from) return error(400);
	if (tommorow > from) return error(400, 'Cant book for yesterday');

	const rooms: number[] = JSON.parse(searchParams.get('rooms') ?? '[]');
	if (rooms.length < 1) return error(400);

	const roomWithInfo = await db.query.rooms.findMany({
		with: {
			roomTypes: true
		},
		where: inArray(roomsTable.id, rooms)
	});

	if (roomWithInfo.length != rooms.length) return error(400);

	return { from, until, rooms: roomWithInfo };
};
