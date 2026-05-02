import { ErrorCodes, ErrorResponse, StatusCodes } from '../../interfaces';
import { BaseError } from './base';

export class Notfound extends BaseError {
	constructor(message: string) {
		super({
			message,
			statusCode: StatusCodes.NOT_FOUND,
			errorCode: ErrorCodes.NOT_FOUND,
		});
	}

	createError(): ErrorResponse {
		return {
			message: this.message,
			code: this.errorCode,
		};
	}
}
