export interface ITask {
	id: string;
	title: string;
	description: string;
	workflow: string;
	boardId: string;
	authorId: string;
}

export type TaskUpdate = Partial<Omit<ITask, 'id' | 'authorId'>>;
