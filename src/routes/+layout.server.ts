import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	if (
		event.locals.user !== null &&
		!event.locals.user.emailVerified &&
		!event.url.href.endsWith('/auth/verify-email') &&
		!event.url.href.includes("?/")
	) {
		return redirect(303, '/auth/verify-email');
	}
};
