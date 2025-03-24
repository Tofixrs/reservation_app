import { db } from '$lib/server/db';
import { roomTypes } from '$lib/server/db/schema';
import { and, eq, max } from 'drizzle-orm';
import type { PageServerLoad } from './search/$types';

export const load: PageServerLoad = async (ev) => {
	const roomType = ev.url.searchParams.get('roomType');
	const [{ value: maxRoomSize }] = await db
		.select({ value: max(roomTypes.size) })
		.from(roomTypes)
		.where(
			and(roomType == null || roomType == '' ? undefined : eq(roomTypes.id, Number(roomType)))
		);

	return { maxRoomSize, selectedRoomType: roomType != '' && roomType != null, roomType };
};
