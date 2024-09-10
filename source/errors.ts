
export default abstract class AppError extends Error {
	constructor(
		public readonly message: string,
		public readonly status: number
	) {
		super(message);
	}
}

export class AlreadyExistsError extends AppError {
	constructor(
        public readonly entity: string,
        message?: string
	) {
		const text = message || `${entity} already exists`;
		super(text, 409);
	}
}

export class NotFoundError extends AppError {
	constructor(
        public readonly entity: string,
        message?: string
	) {
		const text = message ?? `${entity} not found`;
		super(text, 404);
	}
}

export class InvalidAuthError extends AppError {
	constructor(message?: string) {
		const text = message ?? 'Invalid auth data';
		super(text, 404);
	}
}
