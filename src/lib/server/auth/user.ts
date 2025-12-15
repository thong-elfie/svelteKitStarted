import bcrypt from 'bcrypt';
import { db } from '../db';
import type { User } from '$types';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
	return bcrypt.compare(password, hash);
}

export async function createUser(email: string, password: string, name?: string): Promise<User> {
	const hashedPassword = await hashPassword(password);
	
	const user = await db.user.create({
		data: {
			email,
			password: hashedPassword,
			name: name ?? null
		}
	});

	return {
		id: user.id,
		email: user.email,
		name: user.name,
		role: user.role,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt
	};
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
	const user = await db.user.findUnique({
		where: { email }
	});

	if (!user) {
		return null;
	}

	const isValid = await verifyPassword(password, user.password);
	if (!isValid) {
		return null;
	}

	return {
		id: user.id,
		email: user.email,
		name: user.name,
		role: user.role,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt
	};
}

export async function getUserById(id: string): Promise<User | null> {
	const user = await db.user.findUnique({
		where: { id }
	});

	if (!user) {
		return null;
	}

	return {
		id: user.id,
		email: user.email,
		name: user.name,
		role: user.role,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt
	};
}
