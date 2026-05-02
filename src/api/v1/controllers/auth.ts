import { Response, NextFunction } from 'express';
import { IExtendedRequest, StatusCodes } from '../../../interfaces';
import { AuthService } from '../../../services';

type AuthConstructorParams = {
	authService: AuthService;
};

export class AuthController {
	private authService: AuthService;
	constructor({ authService }: AuthConstructorParams) {
		this.authService = authService;
	}
	async getMe(req: IExtendedRequest, res: Response, next: NextFunction) {
		this.authService
			.getMe(req)
			.then((user) => {
				return res
					.status(StatusCodes.OK)
					.json({ data: user, error: {} });
			})
			.catch((error) => {
				req.log?.error(
					'An error occurred while signing in!',
					{ error },
				);
				next(error);
			});
	}

	async signIn(req: IExtendedRequest, res: Response, next: NextFunction) {
		const { email, password } = req.body;
		this.authService
			.getUser(req, { email, password })
			.then((user) => {
				return res
					.status(StatusCodes.OK)
					.cookie('token', user.token, {
						httpOnly: true,
						secure:
							process.env.NODE_ENV ===
							'production',
						maxAge: 7 * 24 * 60 * 60 * 1000,
					})
					.json({ data: user, error: {} });
			})
			.catch((error) => {
				req.log?.error(
					'An error occurred while signing in!',
					{ error },
				);
				next(error);
			});
	}

	async signUp(req: IExtendedRequest, res: Response, next: NextFunction) {
		const { email, name, password } = req.body;
		this.authService
			.createUser(req, { email, name, password })
			.then((user) => {
				return res
					.status(StatusCodes.OK)
					.cookie('token', user.token, {
						httpOnly: true,
						secure:
							process.env.NODE_ENV ===
							'production',
						maxAge: 7 * 24 * 60 * 60 * 1000,
					})
					.json({ data: user, error: {} });
			})
			.catch((error) => {
				req?.log?.error(
					'An error occurred while signing up!',
					{ error },
				);
				next(error);
			});
	}
	async signOut(
		req: IExtendedRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			res.clearCookie('token', {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
			})
				.status(StatusCodes.OK)
				.json({ message: 'Signed out!' });
		} catch (error) {
			req?.log?.error(
				'An error occurred while signing out!',
				{ error },
			);
			next(error);
		}
	}
}
