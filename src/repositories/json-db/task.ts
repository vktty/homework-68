import { BaseRepository } from './base';

export class TaskRepository extends BaseRepository {
	constructor() {
		super('tasks');
	}
	public async updateTaskWorkflow<T, R>(id: string, data: T): Promise<R> {
		return this.db
			.patch(`/${this.resource}/${id}`, data)
			.then((response) => response.data);
	}
}
