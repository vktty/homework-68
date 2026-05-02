import { NextFunction, Response } from 'express';
import { IExtendedRequest, StatusCodes } from '../../../interfaces';
import { TaskService } from '../../../services';

type TaskConstructorParams = {
	taskService: TaskService;
};

export class TaskController {
	private taskService: TaskService;
	constructor({ taskService }: TaskConstructorParams) {
		this.taskService = taskService;
	}
	async getTasks(
		req: IExtendedRequest,
		res: Response,
		next: NextFunction,
	) {
		this.taskService
			.getAll(req)
			.then((tasks) => {
				return res
					.status(StatusCodes.OK)
					.json({ data: tasks });
			})
			.catch((error) => {
				req.log?.error(
					'An error occurred while getting tasks!',
					{ error },
				);
				next(error);
			});
	}
	async getTaskById(
		req: IExtendedRequest,
		res: Response,
		next: NextFunction,
	) {
		const { taskId } = req.params;
		if (!taskId || Array.isArray(taskId))
			return res.status(StatusCodes.BAD_REQUEST).json({
				error: 'Invalid taskId',
			});
		this.taskService
			.findById(req, taskId)
			.then((task) => {
				return res
					.status(StatusCodes.OK)
					.json({ data: task });
			})
			.catch((error) => {
				req.log?.error(
					'An error occurred while getting task!',
					{ error },
				);
				next(error);
			});
	}

	async createTask(
		req: IExtendedRequest,
		res: Response,
		next: NextFunction,
	) {
		const data = req.body;
		this.taskService
			.create(req, data)
			.then((task) => {
				return res
					.status(StatusCodes.CREATED)
					.json({ data: task });
			})
			.catch((error) => {
				req.log?.error(
					'An error occurred while creating task!',
					{ error },
				);
				next(error);
			});
	}

	async updateTask(
		req: IExtendedRequest,
		res: Response,
		next: NextFunction,
	) {
		const { taskId } = req.params;
		const data = req.body;
		if (!taskId || Array.isArray(taskId))
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({
					error: 'Invalid taskId',
				});
		this.taskService
			.update(req, taskId, data)
			.then((task) => {
				return res
					.status(StatusCodes.OK)
					.json({ data: task });
			})
			.catch((error) => {
				req.log?.error(
					'An error occurred while updating task!',
					{ error },
				);
				next(error);
			});
	}

	async updateTaskWorkflow(
		req: IExtendedRequest,
		res: Response,
		next: NextFunction,
	) {
		const { taskId } = req.params;
		const data = req.body;
		if (!taskId || Array.isArray(taskId))
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({
					error: 'Invalid taskId',
				});
		this.taskService
			.update(req, taskId, data)
			.then((task) => {
				return res
					.status(StatusCodes.OK)
					.json({ data: task });
			})
			.catch((error) => {
				req.log?.error(
					"An error occurred while updating task's workflow!",
					{ error },
				);
				next(error);
			});
	}

	async deleteTask(
		req: IExtendedRequest,
		res: Response,
		next: NextFunction,
	) {
		const { taskId } = req.params;
		if (!taskId || Array.isArray(taskId))
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({
					error: 'Invalid taskId',
				});
		this.taskService
			.delete(req, taskId)
			.then(() => {
				return res.status(StatusCodes.DELETED).json({
					message: `Task ${taskId} deleted successfully!`,
				});
			})
			.catch((error) => {
				req.log?.error(
					'An error occurred while deleting task!',
					{ error },
				);
				next(error);
			});
	}
}
