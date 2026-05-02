import { Router } from 'express';
import { body } from 'express-validator';
import { AuthRepository } from '../../../repositories/mongo-db';
import { AuthService } from '../../../services';
import { AuthController } from '../controllers';
import { authVerification } from '../../../middlewares';

export const auth = () => {
	const router = Router();

	const repository = new AuthRepository();
	const service = new AuthService({ repository });
	const controller = new AuthController({ authService: service });

	router.get('/me', authVerification, controller.getMe.bind(controller));
	router.post(
		'/sign-in',
		[
			body('email')
				.isEmail()
				.notEmpty()
				.withMessage('Email is required!')
				.trim(),
			body('password')
				.notEmpty()
				.withMessage('Password is required!')
				.trim()
				.isLength({ min: 5 })
				.withMessage(
					'Password must have at least 5 characters!',
				),
		],
		controller.signIn.bind(controller),
	);

	router.post(
		'/sign-up',
		[
			body('name')
				.notEmpty()
				.withMessage('Name is required!')
				.trim(),
			body('email')
				.isEmail()
				.notEmpty()
				.withMessage('Email is required!')
				.trim(),
			body('password')
				.notEmpty()
				.withMessage('Password is required!')
				.trim()
				.isLength({ min: 5 })
				.withMessage(
					'Password must have at least 5 characters!',
				),
		],
		controller.signUp.bind(controller),
	);

	router.post('/sign-out', controller.signOut.bind(controller));
	return router;
};
