import { BaseRepository } from './base';

export class TaskRepository extends BaseRepository {
	constructor() {
		super('tasks');
	}
	public async updateTaskWorkflow<T, R>(id: string, data: T): Promise<R> {
		const collection = this.db.collection(this.resource);
		const result = await collection.findOneAndUpdate(
			{ id },
			{ $set: data as any },
			{ returnDocument: 'after' },
		);
		return result as R;
	}
}
