import path from 'node:path';
import winston from 'winston';

const { combine, timestamp, json, errors } = winston.format;

export const createLogger = (logDir: string) => {
	return winston.createLogger({
		level: 'info',
		format: combine(timestamp(), json(), errors({ stack: true })),
		transports: [
			new winston.transports.File({
				filename: path.join(logDir, 'logs.log'),
			}),
			new winston.transports.File({
				filename: path.join(logDir, 'errors.log'),
				level: 'error',
			}),
		],
		defaultMeta: { service: 'tasks-manager' },
	});
};
