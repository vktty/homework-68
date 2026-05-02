import { NextFunction, Response } from 'express';
import {
	ErrorCodes,
	IExtendedError,
	IExtendedRequest,
	StatusCodes,
} from '../interfaces';

export const handleErrors = (
	error: IExtendedError,
	req: IExtendedRequest,
	res: Response,
	next: NextFunction,
) => {
	const { message, ...arg } = error;
	req.log?.error(`Error occured: ${message}`, arg);
	res.status(StatusCodes.COMMON_ERROR).json({
		data: {},
		error: {
			code: ErrorCodes.COMMON_ERROR,
			message,
		},
	});
};
