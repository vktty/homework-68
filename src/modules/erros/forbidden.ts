import { ErrorCodes, ErrorResponse, StatusCodes } from '../../interfaces';
import { BaseError } from './base';

export class Forbidden extends BaseError {
	constructor(message: string) {
		super({
			message,
			statusCode: StatusCodes.FORBIDDEN,
			errorCode: ErrorCodes.FORBIDDEN,
		});
	}

	createError(): ErrorResponse {
		return {
			message: this.message,
			code: this.errorCode,
		};
	}
}
