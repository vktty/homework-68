import { randomBytes, scrypt } from 'node:crypto';

export class Password {
	static async hash(password: string, salt?: string): Promise<string> {
		const preparedSalt = salt || randomBytes(16).toString('hex');

		return new Promise((resolve, reject) => {
			scrypt(
				password,
				preparedSalt,
				64,
				(error, derivedHash) => {
					if (error) {
						return reject(error);
					}
					return resolve(
						`${preparedSalt}:${derivedHash.toString('hex')}`,
					);
				},
			);
		});
	}

	static async verify(existingPassword: string, inputPassword: string) {
		const [salt, hash] = existingPassword.split(':');
		const derived = await Password.hash(inputPassword, salt);
		const [_, derivedHash] = derived.split(':');
		return derivedHash === hash;
	}
}
