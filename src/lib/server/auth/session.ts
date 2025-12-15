import { db } from '../db';
import type { Session, User } from '$types';

const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function createSession(userId: string): Promise<Session> {
	const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

	const session = await db.session.create({
		data: {
			userId,
			expiresAt
		}
	});

	return {
		id: session.id,
		userId: session.userId,
		expiresAt: session.expiresAt,
		createdAt: session.createdAt
	};
}

export async function getSession(sessionId: string): Promise<(Session & { user: User }) | null> {
	const session = await db.session.findUnique({
		where: { id: sessionId },
		include: {
			user: true
		}
	});

	if (!session) {
		return null;
	}

	if (session.expiresAt < new Date()) {
		await deleteSession(sessionId);
		return null;
	}

	return {
		id: session.id,
		userId: session.userId,
		expiresAt: session.expiresAt,
		createdAt: session.createdAt,
		user: {
			id: session.user.id,
			email: session.user.email,
			name: session.user.name,
			role: session.user.role,
			createdAt: session.user.createdAt,
			updatedAt: session.user.updatedAt
		}
	};
}

export async function deleteSession(sessionId: string): Promise<void> {
	await db.session.delete({
		where: { id: sessionId }
	}).catch(() => {
		// Session might already be deleted
	});
}

export async function deleteUserSessions(userId: string): Promise<void> {
	await db.session.deleteMany({
		where: { userId }
	});
}

export async function cleanupExpiredSessions(): Promise<void> {
	await db.session.deleteMany({
		where: {
			expiresAt: {
				lt: new Date()
			}
		}
	});
}
