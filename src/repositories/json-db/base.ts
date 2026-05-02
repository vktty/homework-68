import axios, { AxiosInstance } from 'axios';
import { IRepository } from '../../interfaces';

let client: AxiosInstance | null = null;

export abstract class BaseRepository implements IRepository {
	protected readonly resource: string;
	constructor(resource: string) {
		this.resource = resource;
	}

	protected get db() {
		const client = getClient();
		if (!client) {
			throw new Error('Client not initialazed!');
		}
		return client;
	}

	public async findAll<T>(): Promise<T[]> {
		return this.db
			.get(`/${this.resource}`)
			.then((response) => response.data);
	}
	public async findByQuery<T>(
		query: Record<string, string>,
	): Promise<T[]> {
		const getQuery = Object.entries(query)
			.map(
				([key, value]) =>
					`${key}=${encodeURIComponent(value)}`,
			)
			.join('&');
		return this.db
			.get(`/${this.resource}?${getQuery}`)
			.then((response) => response.data);
	}
	public async findById<T>(id: string): Promise<T> {
		return this.db
			.get(`/${this.resource}/${id}`)
			.then((response) => response.data);
	}
	public async create<T, R>(data: T): Promise<R> {
		return this.db
			.post(`/${this.resource}`, data)
			.then((response) => response.data);
	}
	public async createMany<T, R>(data: T[]): Promise<R[]> {
		return [];
	}
	public async update<T, R>(id: string, data: T): Promise<R> {
		return this.db
			.patch(`/${this.resource}/${id}`, data)
			.then((response) => response.data);
	}
	public async delete(id: string): Promise<void> {
		return this.db.delete(`/${this.resource}/${id}`);
	}
	public async aggregate<T>(pipeline: any[]): Promise<T[]> {
		return [];
	}
}

export const connect = async (baseUrl: string): Promise<AxiosInstance> => {
	client = axios.create({ baseURL: baseUrl });

	return Promise.resolve(client);
};

export const getClient = () => {
	if (!client) {
		throw new Error('Client not initialazed!');
	}
	return client;
};
