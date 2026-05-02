import { WorkflowCode, WorkwlofLabel } from '../interfaces';

const workflowCodes = {
	TODO: WorkflowCode.TODO,
	PROGRESS: WorkflowCode.PROGRESS,
	DONE: WorkflowCode.DONE,
};

const workflowMap: Record<
	string,
	{ code: WorkflowCode; label: WorkwlofLabel }
> = {
	[workflowCodes.TODO]: {
		code: WorkflowCode.TODO,
		label: WorkwlofLabel.TODO,
	},
	[workflowCodes.PROGRESS]: {
		code: WorkflowCode.PROGRESS,
		label: WorkwlofLabel.PROGRESS,
	},
	[workflowCodes.DONE]: {
		code: WorkflowCode.DONE,
		label: WorkwlofLabel.DONE,
	},
};

export const transformWorkflow = (workflow: WorkflowCode) => {
	return workflowMap[workflow];
};
