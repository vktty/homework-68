import express, { NextFunction, Response } from 'express';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { handleErrors, requestLogger } from './middlewares';
import { IApp, IExtendedRequest, StatusCodes } from './interfaces';
import { router } from './api/v1/routes';
import { Notfound } from './modules/erros';

export const createApp = ({ logFilePath }: IApp) => {
	const staticPath = path.join(__dirname, '..', 'public');
	const app = express();
	const clientUrl = process.env.CLIENT_URL!.split(/\s*,\s*/);
	const corsOrigins = {
		origin: clientUrl,
		credentials: true,
		methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
		optionsSuccessStatus: 200,
	};
	app.use(cors(corsOrigins));

	app.use('/static', express.static(staticPath));

	app.use(express.json());
	app.use(cookieParser());
	app.use(requestLogger(logFilePath));

	app.get('/', (req: IExtendedRequest, res: Response) => {
		res.status(StatusCodes.OK).json({
			message: `This is Tasks Manager's home page, ${staticPath}`,
		});
	});

	app.use('/api/v1', router);

	app.use((req: IExtendedRequest, res: Response, next: NextFunction) => {
		next(new Notfound(`Route ${req.path} not found!`));
	});

	app.use(handleErrors);

	return app;
};
