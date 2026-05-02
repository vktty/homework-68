import { Request } from 'express';
import { Logger } from 'winston';
import { IUser } from './user';

export interface IExtendedRequest extends Request {
	log?: Logger;
	user?: Pick<IUser, 'id'>;
}
