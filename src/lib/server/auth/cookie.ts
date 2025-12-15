import { serialize, parse } from 'cookie';
import type { RequestEvent } from '@sveltejs/kit';

const COOKIE_NAME = 'session';

interface CookieOptions {
	httpOnly: boolean;
	secure: boolean;
	sameSite: 'lax' | 'strict' | 'none';
	path: string;
	maxAge: number;
}

const DEFAULT_OPTIONS: CookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'lax',
	path: '/',
	maxAge: 30 * 24 * 60 * 60 // 30 days
};

export function setSessionCookie(sessionId: string, options: Partial<CookieOptions> = {}): string {
	return serialize(COOKIE_NAME, sessionId, {
		...DEFAULT_OPTIONS,
		...options
	});
}

export function deleteSessionCookie(): string {
	return serialize(COOKIE_NAME, '', {
		...DEFAULT_OPTIONS,
		maxAge: 0
	});
}

export function getSessionIdFromCookies(cookieHeader: string | null): string | null {
	if (!cookieHeader) {
		return null;
	}

	const cookies = parse(cookieHeader);
	return cookies[COOKIE_NAME] ?? null;
}

export function getSessionIdFromEvent(event: RequestEvent): string | null {
	return getSessionIdFromCookies(event.request.headers.get('cookie'));
}
