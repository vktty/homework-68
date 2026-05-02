export interface IRepository {
	findAll<T>(): Promise<T[]>;
	findByQuery<T>(query: Record<string, string>): Promise<T[]>;
	findById<T>(id: string): Promise<T>;
	create<T, R>(data: T): Promise<R>;
	createMany<T, R>(data: T[]): Promise<R[]>;
	update<T, R>(id: string, data: T): Promise<R>;
	delete(id: string): Promise<void>;
	aggregate<T>(pipeline: any[]): Promise<T[]>;
}

export interface ITaskRepository extends IRepository {
	updateTaskWorkflow<T, R>(id: string, data: T): Promise<R>;
}

export interface MongoBdOptions {
	uri: string;
	name: string;
	user: string;
	password: string;
}
