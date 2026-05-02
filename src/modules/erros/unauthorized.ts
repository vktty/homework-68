import { ErrorCodes, ErrorResponse, StatusCodes } from '../../interfaces';
import { BaseError } from './base';

export class Unauthorized extends BaseError {
	constructor(message: string) {
		super({
			message,
			statusCode: StatusCodes.UNAUTHORIZED,
			errorCode: ErrorCodes.UNAUTHORIZED,
		});
	}

	createError(): ErrorResponse {
		return {
			message: this.message,
			code: this.errorCode,
		};
	}
}
