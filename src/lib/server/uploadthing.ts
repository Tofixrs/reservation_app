import { createUploadthing, UploadThingError, UTApi } from 'uploadthing/server';
import type { FileRouter } from 'uploadthing/server';
import { validateSessionToken } from './session';
import { env } from '$env/dynamic/private';

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
	// Define as many FileRoutes as you like, each with a unique routeSlug
	roomImageUploader: f({
		image: {
			/**
			 * For full list of options and defaults, see the File Route API reference
			 * @see https://docs.uploadthing.com/file-routes#route-config
			 */
			maxFileSize: '4MB'
		}
	})
		// Set permissions and file types for this FileRoute
		.middleware(async ({ req }) => {
			const cookies =
				req.headers
					.get('cookie')
					?.split('; ')
					.map((v) => {
						return v.split('=');
					})
					.reduce(
						(init, v) => {
							init[v[0]] = v[1];
							return init;
						},
						{} as Record<string, string>
					) ?? {};
			const sessionID = cookies['session'];

			const { session, user } = await validateSessionToken(sessionID);
			if (session === null) throw new UploadThingError('Not authorized');
			if (!user.admin) throw new UploadThingError('Not authorized');

			return {};
		})
		.onUploadComplete(async ({ metadata, file }) => {})
} satisfies FileRouter;

export const utapi = new UTApi({
	token: env.UPLOADTHING_TOKEN
});

export type OurFileRouter = typeof ourFileRouter;
