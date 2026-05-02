import { ErrorCodes, ErrorResponse, StatusCodes } from '../../interfaces';
import { BaseError } from './base';

export class InternalServer extends BaseError {
	constructor(message: string) {
		super({
			message,
			statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
			errorCode: ErrorCodes.INTERNAL_SERVER_ERROR,
		});
	}

	createError(): ErrorResponse {
		return {
			message: this.message,
			code: this.errorCode,
		};
	}
}
