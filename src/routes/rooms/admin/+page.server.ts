import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { roomImageKeys, rooms } from '$lib/server/db/schema';
import { utapi } from '$lib/server/uploadthing';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user === null) {
		return redirect(303, '/auth/login');
	}
	if (!event.locals.user.emailVerified) return redirect(303, '/auth/verify-email');
	if (!event.locals.user.admin) return redirect(303, '/');

	const rooms = await db.query.rooms.findMany();
	return { rooms };
};
export const actions: Actions = {
	addRoom: async (ev) => {
		if (ev.locals.session === null) return fail(401);
		if (ev.locals.user === null) return fail(401);
		if (!ev.locals.user.admin) {
			return fail(403);
		}

		const data = await ev.request.formData();
		const images = data.getAll('images') as File[];
		const uploads = await utapi.uploadFiles(images);
		const errors = uploads.map((v) => v.error).filter((v) => v != null);
		if (errors.length > 0) return error(500, new AggregateError(errors, 'Upload errors'));

		const name = data.get('name') as string;
		const desc = data.get('desc') as string;
		const size = Number(data.get('size'));

		const roomID = await db
			.insert(rooms)
			.values({
				name,
				description: desc,
				size
			})
			.returning();

		const res = await db
			.insert(roomImageKeys)
			.values(uploads.map((v) => ({ roomID: roomID[0].id, imageKey: v.data!.key })));

		if (res.rowCount == null || res.rowCount < 1) {
			await db.delete(rooms).where(eq(rooms.id, roomID[0].id));
			return fail(500);
		}
		return { sucess: true };
	}
};
