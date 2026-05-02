import { Router } from 'express';
import { body, query } from 'express-validator';
import { TaskRepository } from '../../../repositories/mongo-db';
import { TaskService } from '../../../services';
import { TaskController } from '../controllers';

export const tasks = () => {
	const router = Router();

	const repository = new TaskRepository();
	const service = new TaskService({ repository });
	const controller = new TaskController({ taskService: service });

	router.route('/')
		.get(
			[
				query('boardId')
					.trim()
					.notEmpty()
					.withMessage('boardId is required!'),
			],

			controller.getTasks.bind(controller),
		)
		.post(
			[
				body('title')
					.trim()
					.notEmpty()
					.withMessage(
						'This is a required field!',
					),
				body('description')
					.trim()
					.notEmpty()
					.withMessage(
						'This is a required field!',
					),
			],
			controller.createTask.bind(controller),
		);

	router.route('/:taskId')
		.get(
			[
				query('boardId')
					.trim()
					.notEmpty()
					.withMessage('boardId is required!'),
			],
			controller.getTaskById.bind(controller),
		)
		.patch(
			[body('title').trim(), body('description').trim()],
			controller.updateTask.bind(controller),
		)
		.delete(controller.deleteTask.bind(controller));

	router.patch(
		'/:taskId/workflow',
		controller.updateTaskWorkflow.bind(controller),
	);
	return router;
};
