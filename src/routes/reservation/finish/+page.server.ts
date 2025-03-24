import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { inArray } from 'drizzle-orm';
import { reservationRooms, reservations, rooms as roomsTable } from '$lib/server/db/schema';
import { mailer } from '$lib/server/oauth';

export const load: PageServerLoad = async (ev) => {
	if (ev.url.searchParams.get('done') != null) return;
	if (!ev.locals.user) {
		ev.cookies.set('after_login', ev.url.href, {
			path: '/',
			httpOnly: true,
			maxAge: 60 * 10,
			sameSite: 'lax'
		});
		return redirect(303, `/auth/register`);
	}

	const { searchParams } = ev.url;
	const tommorow = new Date();
	tommorow.setDate(tommorow.getDate() + 1);
	tommorow.setHours(0, 0, 0, 0);

	const from = new Date(Number(searchParams.get('from')) ?? 0);
	const until = new Date(Number(searchParams.get('until')) ?? 0);
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

	const diff = until.getTime() - from.getTime();
	const days = diff / 86400000 + 1;
	const people = Number(ev.url.searchParams.get('people'));
	const additions = JSON.parse(ev.url.searchParams.get('additions') ?? '{}');
	const price =
		20 * Number(additions.food) * people * days +
		roomWithInfo.reduce((acc, v) => acc + v.roomTypes.pricePerDay * days, 0);

	const reservation = await db
		.insert(reservations)
		.values({
			timeOfArrival: from,
			timeOfLeave: until,
			userId: ev.locals.user.id
		})
		.returning();

	await db
		.insert(reservationRooms)
		.values(rooms.map((v) => ({ roomId: v, reservationID: reservation[0].id })));

	const lang = ev.request.headers.get('accept-language')?.split(',')[0] ?? 'en-US';

	await mailer.sendMail({
		to: ev.locals.user.email,
		subject: 'Potwierdzenie rezerwacji',
		html: `
			<p>
				Wykonano rezerwacje na dzien ${from.toLocaleDateString(lang, {
					day: '2-digit',
					weekday: 'long',
					month: 'long',
					year: 'numeric'
				})}
			</p>
			<p>Koszt: ${price}zł</p>`
	});
	return redirect(300, `${ev.url.href}&done=done`);
};
