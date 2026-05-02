import { AuthRepository } from '../repositories/mongo-db';
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
		const repository = new AuthRepository();
		return repository.createMany(DATA.users);
	})
	.then((result) => console.log('Users', result))
	.catch((error) => {
		console.error(
			`An error occured while connecting to MongoDB: ${error}`,
		);
	})
	.finally(() => {
		console.log("The end of users' migration");
		const client = getClient();
		client.close();
	});
