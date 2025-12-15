import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { authenticateUser } from '$lib/server/auth/user';
import { createSession } from '$lib/server/auth/session';
import { setSessionCookie } from '$lib/server/auth/cookie';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString();

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required' });
		}

		const user = await authenticateUser(email, password);

		if (!user) {
			return fail(401, { error: 'Invalid email or password' });
		}

		const session = await createSession(user.id);
		const cookie = setSessionCookie(session.id);

		cookies.set('session', session.id, {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 30 * 24 * 60 * 60
		});

		throw redirect(303, user.role === 'ADMIN' ? '/admin' : '/');
	}
} satisfies Actions;
