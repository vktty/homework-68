import { BaseRepository } from './base';

export class AuthRepository extends BaseRepository {
	constructor() {
		super('users');
	}
}
