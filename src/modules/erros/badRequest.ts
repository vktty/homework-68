import { ErrorCodes, ErrorResponse, StatusCodes } from '../../interfaces';
import { BaseError } from './base';

export class BadRequest extends BaseError {
	constructor(message: string) {
		super({
			message,
			statusCode: StatusCodes.BAD_REQUEST,
			errorCode: ErrorCodes.BAD_REQUEST,
		});
	}

	createError(): ErrorResponse {
		return {
			message: this.message,
			code: this.errorCode,
		};
	}
}
