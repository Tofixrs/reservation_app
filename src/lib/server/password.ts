import { hash } from '@node-rs/argon2';

export function hashPassword(password: string) {
	return hash(password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 64,
		parallelism: 2
	});
}
