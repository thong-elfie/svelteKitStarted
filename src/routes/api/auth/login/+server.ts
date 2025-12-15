import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { authenticateUser } from '$lib/server/auth/user';
import { createSession } from '$lib/server/auth/session';

export const POST: RequestHandler = async ({ request }) => {
	const { email, password } = await request.json();

	if (!email || !password) {
		return json({ error: 'Email and password are required' }, { status: 400 });
	}

	const user = await authenticateUser(email, password);

	if (!user) {
		return json({ error: 'Invalid email or password' }, { status: 401 });
	}

	const session = await createSession(user.id);

	return json({
		user,
		sessionId: session.id
	});
};
