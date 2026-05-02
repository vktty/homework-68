export interface IBoard {
	id: string;
	name: string;
	description: string;
	authorId: string;
}
export type BoardUpdate = Partial<Omit<IBoard, 'id' | 'authorId'>>;
