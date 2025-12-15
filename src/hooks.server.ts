import type { Handle } from '@sveltejs/kit';
import { getSessionIdFromEvent } from '$lib/server/auth/cookie';
import { getSession } from '$lib/server/auth/session';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = getSessionIdFromEvent(event);

	if (sessionId) {
		const session = await getSession(sessionId);
		if (session) {
			event.locals.user = session.user;
			event.locals.sessionId = session.id;
		}
	}

	return resolve(event);
};
