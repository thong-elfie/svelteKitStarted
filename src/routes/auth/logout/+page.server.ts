import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { deleteSession } from '$lib/server/auth/session';
import { deleteSessionCookie } from '$lib/server/auth/cookie';

export const actions = {
	default: async ({ locals, cookies }) => {
		if (locals.sessionId) {
			await deleteSession(locals.sessionId);
		}

		cookies.set('session', '', {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 0
		});

		throw redirect(303, '/auth/login');
	}
} satisfies Actions;
