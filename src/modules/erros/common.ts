import { ErrorCodes, ErrorResponse, StatusCodes } from '../../interfaces';
import { BaseError } from './base';

export class Common extends BaseError {
	constructor(message: string) {
		super({
			message,
			statusCode: StatusCodes.COMMON_ERROR,
			errorCode: ErrorCodes.COMMON_ERROR,
		});
	}

	createError(): ErrorResponse {
		return {
			message: this.message,
			code: this.errorCode,
		};
	}
}
