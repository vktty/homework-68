import { Response, NextFunction, RequestHandler } from 'express';
import { IExtendedRequest } from '../interfaces';
import { Logger } from 'winston';

export const requestLogger = (instance: Logger) => {
	return (req: IExtendedRequest, res: Response, next: NextFunction) => {
		req.log = instance.child({
			requestID: crypto.randomUUID(),
			method: req.method,
			url: req.url,
		});

		res.on('finish', () => {
			req.log?.info('Request completed');
		});

		next();
	};
};
