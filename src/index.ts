import path from 'node:path';
import { connect } from './repositories/mongo-db';
import { createApp } from './tasks-manager';
import { createLogger } from './modules';

try {
	const { PORT, DB_URI, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } =
		process.env;
	if (!PORT) {
		console.error("PORT isn't defined");
	}
	if (!DB_PORT || !DB_URI || !DB_NAME || !DB_USER || !DB_PASSWORD) {
		console.error(
			"DB_PORT or DB_URI or DB_NAME or DB_USER or DB_PASSWORD isn't defined",
		);
		throw new Error(
			"DB_PORT or DB_URI or DB_NAME or DB_USER or DB_PASSWORD isn't defined",
		);
	}
	connect({
		uri: DB_URI || '',
		name: DB_NAME || '',
		user: DB_USER || '',
		password: DB_PASSWORD || '',
	})
		.then(() => {
			const logs = path.join(__dirname, 'logs');
			const logger = createLogger(logs);
			const app = createApp({ logFilePath: logger });
			app.listen(PORT, () =>
				logger.info(
					`Server running at http://localhost:${PORT}/`,
				),
			);
		})
		.catch((error) => {
			console.error(
				'An error occurred while connecting to JSON server',
				{
					error,
				},
			);
		});
} catch (error) {
	console.error('An error occurred while starting an app', {
		error,
	});
	process.exit(1);
}
