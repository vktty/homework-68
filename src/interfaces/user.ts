export interface IUser {
	id: string;
	name: string;
	email: string;
	password: string;
	createdAt: string;
}

export type UserUpdate = Partial<Omit<IUser, 'id'>>;
export type UserReturn = Omit<IUser, 'password'>;
