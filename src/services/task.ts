import { validationResult } from 'express-validator';
import {
	IBoard,
	IExtendedRequest,
	ITask,
	ITaskRepository,
	TaskUpdate,
	WorkflowCode,
} from '../interfaces';
import {
	BadRequest,
	Forbidden,
	Notfound,
	ValidationError,
} from '../modules/erros';
import { transformWorkflow } from '../utils';

type TaskConstructorParams = {
	repository: ITaskRepository;
};

export class TaskService {
	private readonly repository: ITaskRepository;
	constructor({ repository }: TaskConstructorParams) {
		this.repository = repository;
	}
	public async getAll(req: IExtendedRequest) {
		const { boardId } = req.query;

		if (!boardId) {
			throw new BadRequest('boardId required');
		}
		const [board] = await this.repository.findByQuery<IBoard>({
			boardId: boardId as string,
		});

		if (!board) {
			throw new Notfound('Board not found!');
		}
		if (board.authorId != req.user!.id) {
			throw new Forbidden(
				'You are not the author of this board!',
			);
		}

		const tasks = await this.repository.aggregate<ITask>([
			{
				$match: {
					authorId: req.user!.id,
					boardId: boardId as string,
				},
			},
		]);

		if (!tasks || tasks.length === 0) {
			throw new Notfound('Tasks not found!');
		}

		return tasks.map((task) => ({
			...task,
			workflow: transformWorkflow(
				task.workflow as WorkflowCode,
			),
		}));
	}
	public async findById(req: IExtendedRequest, id: string) {
		const task = await this.repository.findById<ITask>(id);
		if (!task) {
			throw new Notfound('Task not found!');
		}
		if (task.authorId != req.user!.id) {
			throw new Forbidden(
				'You are not the author of this task!',
			);
		}

		return {
			...task,
			workflow: transformWorkflow(
				task.workflow as WorkflowCode,
			),
		};
	}
	public async create(req: IExtendedRequest, data: ITask) {
		const authorId = req.user!.id;
		const resultValidation = validationResult(req);

		if (!resultValidation.isEmpty()) {
			throw new ValidationError(
				'Validation failed',
				resultValidation.array(),
			);
		}
		const createdTask = {
			...data,
			description: data.description || '',
			workflow: data.workflow,
			id: crypto.randomUUID(),
			authorId,
		};
		return this.repository.create(createdTask);
	}
	public async update(
		req: IExtendedRequest,
		id: string,
		data: TaskUpdate,
	) {
		const task = await this.repository.findById<ITask>(id);
		if (!task) {
			throw new Notfound('Task not found!');
		}
		if (task.authorId != req.user!.id) {
			throw new Forbidden(
				'You are not the author of this task!',
			);
		}

		const updatedTask = await this.repository.update<
			TaskUpdate,
			ITask
		>(id, data);
		return {
			...updatedTask,
			workflow: transformWorkflow(
				updatedTask.workflow as WorkflowCode,
			),
		};
	}
	public async updateTaskWorkflow(
		req: IExtendedRequest,
		id: string,
		data: TaskUpdate,
	) {
		const task = await this.repository.findById<ITask>(id);
		if (!task) {
			throw new Notfound('Task not found!');
		}
		if (task.authorId != req.user!.id) {
			throw new Forbidden(
				'You are not the author of this task!',
			);
		}

		const updatedTaskWorkflow =
			await this.repository.updateTaskWorkflow<
				TaskUpdate,
				ITask
			>(id, data);
		return {
			...updatedTaskWorkflow,
			workflow: transformWorkflow(
				updatedTaskWorkflow.workflow as WorkflowCode,
			),
		};
	}

	public async delete(req: IExtendedRequest, id: string) {
		const task = await this.repository.findById<ITask>(id);
		if (task.authorId != req.user!.id) {
			throw new Forbidden(
				'You are not the author of this board!',
			);
		}
		await this.repository.delete(id);
		return null;
	}
}
