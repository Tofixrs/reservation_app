import { db } from '$lib/server/db';
import { and, eq, notExists, lte, gte, exists, asc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { reservationRooms, reservations, rooms, roomTypes } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async (ev) => {
	const { searchParams } = ev.url;

	const tommorow = new Date();
	tommorow.setDate(tommorow.getDate() + 1);
	tommorow.setHours(0, 0, 0, 0);

	const roomType = searchParams.get('roomType');
	const from = new Date(searchParams.get('from') ?? 0);
	const until = new Date(searchParams.get('until') ?? 0);
	if (until < from) return error(400);
	if (tommorow > from) return error(400, 'Cant book for yesterday');

	const maxPrice = searchParams.get('maxPrice');
	const maxPriceNum = Number(maxPrice);
	const roomSizes: number[] = JSON.parse(searchParams.get('rooms') ?? '[]');
	const maxSize = roomSizes.reduce((acc, v) => {
		if (v > acc) acc = v;
		return acc;
	}, 0);
	const minSize = roomSizes.reduce((acc, v) => {
		if (v < acc) acc = v;
		return acc;
	}, maxSize);
	if (from == null || until == null || isNaN(maxPriceNum) || roomSizes.length == 0)
		return error(400);

	const diff = until.getTime() - from.getTime();
	const days = diff / 86400000 + 1;

	const search = await db.query.rooms.findMany({
		with: {
			roomTypes: {
				with: {
					roomImageKeys: true
				}
			}
		},
		orderBy: asc(rooms.id),
		where: and(
			roomTypes == null || roomType == '' ? undefined : eq(rooms.roomTypeId, Number(roomType)),
			notExists(
				db
					.select()
					.from(reservationRooms)
					.where(
						and(
							eq(reservationRooms.roomId, rooms.id),
							exists(
								db
									.select()
									.from(reservations)
									.where(
										and(
											eq(reservations.id, reservationRooms.reservationID),
											lte(reservations.timeOfArrival, until),
											gte(reservations.timeOfLeave, from)
										)
									)
							)
						)
					)
			),
			exists(
				db
					.select()
					.from(roomTypes)
					.where(
						and(
							eq(rooms.roomTypeId, roomTypes.id),
							lte(roomTypes.size, maxSize),
							gte(roomTypes.size, minSize),
							maxPrice == undefined || maxPrice == ''
								? undefined
								: lte(roomTypes.pricePerDay, Number(maxPrice) / days)
						)
					)
			)
		)
	});
	if (search.length < roomSizes.length) {
		return { notEnoughRoomsOfSize: true, search: [], from, until, roomSizes };
	}
	return { search, from, until, roomSizes };
};
