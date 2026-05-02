import { ValidationError as ValidationErrorDetails } from 'express-validator';
import { BaseError } from './base';
import { ErrorCodes, ErrorResponse, StatusCodes } from '../../interfaces';

export class ValidationError extends BaseError {
	private readonly details: ValidationErrorDetails[];
	constructor(message: string, details: ValidationErrorDetails[] = []) {
		super({
			message,
			statusCode: StatusCodes.BAD_REQUEST,
			errorCode: ErrorCodes.VALIDATION_ERROR,
		});
		this.details = details;
	}

	createError(): ErrorResponse {
		const details = this.details
			.filter((error) => error.type === 'field')
			.map((error) => ({
				field: error.path,
				message: error.msg,
			}));

		return {
			message: this.message,
			code: this.errorCode,
			details: details || [],
		};
	}
}
