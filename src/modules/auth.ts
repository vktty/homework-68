import jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { IExtendedRequest, IUser } from '../interfaces';
import { BadRequest } from '../modules/erros';

export const authVerification = (
	req: IExtendedRequest,
	res: Response,
	next: NextFunction,
) => {
	const token = req.cookies.token;
	if (!token) {
		return next(new BadRequest('No auth token'));
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
			user: Pick<IUser, 'id'>;
		};
		req.user = decoded.user;
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			return next(new BadRequest('Token expired!'));
		}
		return next(error);
	}
	next();
};
