import { ErrorCodes, ErrorResponse, StatusCodes } from '../../interfaces';

interface BaseErrorConstructorParams {
	message: string;
	statusCode: StatusCodes;
	errorCode: ErrorCodes;
}

export abstract class BaseError extends Error {
	public statusCode: StatusCodes;
	public errorCode: ErrorCodes;
	constructor({
		message,
		statusCode,
		errorCode,
	}: BaseErrorConstructorParams) {
		super(message);
		this.statusCode = statusCode;
		this.errorCode = errorCode;
	}

	abstract createError(): ErrorResponse;
}
