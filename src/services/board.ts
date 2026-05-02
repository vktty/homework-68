import { validationResult } from 'express-validator';
import {
	BoardUpdate,
	IBoard,
	IExtendedRequest,
	IRepository,
	ITask,
	WorkflowCode,
} from '../interfaces';
import {
	Forbidden,
	Notfound,
	Unauthorized,
	ValidationError,
} from '../modules/erros';
import { transformWorkflow } from '../utils';

type BoardConstructorParams = {
	boardRepository: IRepository;
	taskRepository: IRepository;
};

export class BoardService {
	private readonly boardRepository: IRepository;
	private readonly taskRepository: IRepository;

	constructor({
		boardRepository,
		taskRepository,
	}: BoardConstructorParams) {
		this.boardRepository = boardRepository;
		this.taskRepository = taskRepository;
	}
	public async getAllBoards(req: IExtendedRequest) {
		if (!req.user!.id) {
			throw new Unauthorized('You are not authorized!');
		}
		const authorId = req.user!.id;

		const boards = await this.boardRepository.aggregate([
			{ $match: { authorId } },
			{ $sort: { name: 1 } },
			{
				$lookup: {
					from: 'tasks',
					localField: 'id',
					foreignField: 'boardId',
					as: 'tasks',
				},
			},
			{ $addFields: { tasksCount: { $size: '$tasks' } } },
			{ $project: { tasks: 0 } },
		]);
		return boards;
	}
	public async getAllBoardTasks(req: IExtendedRequest) {
		const { boardId } = req.params;
		if (!boardId) {
		}
		const board = await this.boardRepository.findById<IBoard>(
			boardId as string,
		);

		if (!board) {
			throw new Notfound('Board not found!');
		}
		if (board.authorId != req.user!.id) {
			throw new Forbidden(
				'You are not the author of this board!',
			);
		}

		const tasks = await this.taskRepository.findByQuery<ITask>({
			authorId: req.user!.id,
			boardId: boardId as string,
		});

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
		const board = await this.boardRepository.findById<IBoard>(id);
		if (!board) {
			throw new Notfound('Board not found!');
		}
		if (board.authorId != req.user!.id) {
			throw new Forbidden(
				'You are not the author of this board!',
			);
		}

		return board;
	}
	public async create(req: IExtendedRequest, data: IBoard) {
		const authorId = req.user!.id;
		const resultValidation = validationResult(req);

		if (!resultValidation.isEmpty()) {
			throw new ValidationError(
				'Validation failed',
				resultValidation.array(),
			);
		}
		const createdBoard = {
			...data,
			id: crypto.randomUUID(),
			authorId,
		};

		return await this.boardRepository.create(createdBoard);
	}
	public async update(
		req: IExtendedRequest,
		id: string,
		data: BoardUpdate,
	) {
		const board = await this.boardRepository.findById<IBoard>(id);
		if (!board) {
			throw new Notfound('Board not found!');
		}
		if (board.authorId != req.user!.id) {
			throw new Forbidden(
				'You are not the author of this board!',
			);
		}

		return await this.boardRepository.update(id, data);
	}
	public async delete(req: IExtendedRequest, id: string) {
		const board = await this.boardRepository.findById<IBoard>(id);
		if (board.authorId != req.user!.id) {
			throw new Forbidden(
				'You are not the author of this board!',
			);
		}
		await this.boardRepository.delete(id);
		return null;
	}
}
