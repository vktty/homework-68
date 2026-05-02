import { BoardRepository } from '../repositories/mongo-db';
import { connect, getClient } from '../repositories/mongo-db/base';
import DATA from './initialData/db.json';

const { DB_URI, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

connect({
	uri: DB_URI || '',
	name: DB_NAME || '',
	user: DB_USER || '',
	password: DB_PASSWORD || '',
})
	.then(() => {
		console.log('Connected to MongoDB');
		const repository = new BoardRepository();
		return repository.createMany(DATA.boards);
	})
	.then((result) => console.log('Boards', result))
	.catch((error) => {
		console.error(
			`An error occured while connecting to MongoDB: ${error}`,
		);
	})
	.finally(() => {
		console.log("The end of boards' migration");
		const client = getClient();
		client.close();
	});
