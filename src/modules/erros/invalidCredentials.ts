import { ErrorCodes, ErrorResponse, StatusCodes } from '../../interfaces';
import { BaseError } from './base';

export class InvalidCredentials extends BaseError {
	constructor(message: string) {
		super({
			message,
			statusCode: StatusCodes.BAD_REQUEST,
			errorCode: ErrorCodes.INVALID_CREDENTIALS,
		});
	}

	createError(): ErrorResponse {
		return {
			message: this.message,
			code: this.errorCode,
		};
	}
}
