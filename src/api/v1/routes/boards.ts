import { Router } from 'express';
import { body, query } from 'express-validator';
import {
	BoardRepository,
	TaskRepository,
} from '../../../repositories/mongo-db';
import { BoardService } from '../../../services';
import { BoardController } from '../controllers';

export const board = () => {
	const router = Router();

	const boardRepository = new BoardRepository();
	const taskRepository = new TaskRepository();
	const service = new BoardService({ boardRepository, taskRepository });
	const controller = new BoardController({ boardService: service });

	router.route('/')
		.get(controller.getBoards.bind(controller))
		.post(
			[
				body('name')
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
			controller.createBoard.bind(controller),
		);

	router.route('/:boardId')
		.get(controller.getBoardById.bind(controller))
		.patch(
			[body('name').trim(), body('description').trim()],
			controller.updateBoard.bind(controller),
		)
		.delete(controller.deleteBoard.bind(controller));

	router.route('/:boardId/tasks').get(
		controller.getBoardTasks.bind(controller),
	);
	return router;
};
