import { Db, MongoClient } from 'mongodb';
import { IRepository, MongoBdOptions } from '../../interfaces';
import { updatedTask } from '../../utils';

let client: MongoClient;
let db: Db;

export abstract class BaseRepository implements IRepository {
	protected readonly resource: string;
	constructor(resource: string) {
		this.resource = resource;
	}

	protected get db() {
		const client = getDb();
		if (!client) {
			throw new Error('Client not initialazed!');
		}
		return client;
	}

	public async findAll<T>(): Promise<T[]> {
		const collection = this.db.collection(this.resource);
		const result = await collection.find().toArray();
		return result as T[];
	}

	public async findByQuery<T>(
		query: Record<string, string>,
	): Promise<T[]> {
		const collection = this.db.collection(this.resource);

		const result = await collection
			.find(query, { projection: { _id: 0 } })
			.toArray();

		return result as T[];
	}
	public async findById<T>(id: string): Promise<T> {
		const collection = this.db.collection(this.resource);
		const result = await collection.findOne(
			{ id },
			{ projection: { _id: 0 } },
		);

		return result as T;
	}
	public async create<T, R>(data: T): Promise<R> {
		const collection = this.db.collection(this.resource);
		const result = await collection.insertOne(data as any);

		return collection.findOne({
			_id: result.insertedId,
		}) as Promise<R>;
	}
	public async createMany<T, R>(data: T[]): Promise<R[]> {
		const collection = this.db.collection(this.resource);
		const result = await collection.insertMany(data as any);
		return [];
	}
	public async update<T, R>(id: string, data: T): Promise<R> {
		const collection = this.db.collection(this.resource);

		const cleanData = updatedTask(data);

		const result = await collection.findOneAndUpdate(
			{ id },
			{ $set: cleanData as any },
			{ returnDocument: 'after' },
		);
		return result as R;
	}
	public async delete(id: string): Promise<any> {
		const collection = this.db.collection(this.resource);
		return collection.deleteOne({ id });
	}
	public async aggregate<T>(pipeline: any[]): Promise<T[]> {
		const collection = this.db.collection(this.resource);
		const result = await collection.aggregate(pipeline).toArray();
		return result as T[];
	}
}

export const connect = async (
	options: MongoBdOptions,
): Promise<MongoClient> => {
	const uri = options.uri
		.replace('{{user}}', encodeURIComponent(options.user))
		.replace('{{password}}', encodeURIComponent(options.password));
	const mongoClient = new MongoClient(uri);
	const connectedClient = await mongoClient.connect();
	client = connectedClient;
	db = connectedClient.db(options.name);

	await db
		.collection('users')
		.createIndex({ email: 1 }, { unique: true });

	return Promise.resolve(client);
};

export const getClient = () => {
	if (!client) {
		throw new Error('Client not initialazed!');
	}
	return client;
};

export const getDb = () => {
	if (!db) {
		throw new Error('Db not initialazed!');
	}
	return db;
};
