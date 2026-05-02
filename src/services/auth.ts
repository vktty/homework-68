import jwt from 'jsonwebtoken';
import {
	IExtendedRequest,
	IRepository,
	IUser,
	UserReturn,
} from '../interfaces';
import { Password } from '../modules';
import {
	InvalidCredentials,
	Notfound,
	ValidationError,
} from '../modules/erros';
import { validationResult } from 'express-validator';

type AuthConstructorParams = {
	repository: IRepository;
};

export class AuthService {
	private readonly repository: IRepository;

	constructor({ repository }: AuthConstructorParams) {
		this.repository = repository;
	}
	public async getMe(req: IExtendedRequest) {
		const userId = req.user!.id;
		if (!userId) {
			throw new Notfound('User with this ID not found!');
		}
		const user = await this.repository.findById<IUser>(userId);
		if (!user) {
			throw new Notfound('User not found!');
		}

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			createdAt: user.createdAt,
		};
	}

	public async createUser(
		req: IExtendedRequest,
		{
			email,
			name,
			password,
		}: Pick<IUser, 'email' | 'name' | 'password'>,
	) {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			throw new ValidationError('Validation failed');
		}

		const hashedPassword = await Password.hash(password);

		const newUser = {
			id: crypto.randomUUID(),
			name,
			email,
			password: hashedPassword,
			createdAt: new Date().toISOString(),
		};

		const [existingUser] =
			await this.repository.findByQuery<UserReturn>({
				email,
			});

		if (existingUser) {
			throw new ValidationError(
				'User with this email already exists!',
			);
		}

		const createdUser = await this.repository.create<IUser, IUser>(
			newUser,
		);

		const token = jwt.sign(
			{ user: { id: newUser.id } },
			process.env.JWT_SECRET!,
			{ expiresIn: '7d' },
		);
		const { password: _, ...userData } = createdUser;

		return { ...userData, token };
	}

	public async getUser(
		req: IExtendedRequest,
		{ email, password }: Pick<IUser, 'email' | 'password'>,
	) {
		const resultValidation = validationResult(req);
		if (!resultValidation.isEmpty()) {
			throw new ValidationError(
				'Validation failed',
				resultValidation.array(),
			);
		}

		const [existingUser] = await this.repository.findByQuery<IUser>(
			{ email },
		);

		if (!existingUser) {
			throw new Notfound(
				"User with this email doen't exist!",
			);
		}

		const result = await Password.verify(
			existingUser.password,
			password,
		);
		if (!result) {
			throw new InvalidCredentials('Invalid credentials');
		}

		const token = jwt.sign(
			{ user: { id: existingUser.id } },
			process.env.JWT_SECRET!,
			{ expiresIn: '7d' },
		);
		const { password: _, ...userData } = existingUser;

		return { ...userData, token };
	}
}
