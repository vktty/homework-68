export enum ErrorCodes {
	VALIDATION_ERROR = 'VALIDATION_ERROR',
	INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
	UNAUTHORIZED = 'UNAUTHORIZED',
	FORBIDDEN = 'FORBIDDEN',
	NOT_FOUND = 'NOT_FOUND',
	COMMON_ERROR = 'COMMON_ERROR',
	INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
	BAD_REQUEST = 'BAD_REQUEST',
}

export type ErrorResponse = {
	message: string;
	code: ErrorCodes;
	details?: Array<{ field: string; message: string }>;
};
