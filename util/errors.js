class ErrorBuilder {
	constructor(message, statusCode) {
		this._message = message;
		this._statusCode = statusCode;
	}

	build() {
		const template = this._message;
		const statusCode = this._statusCode;

		return class CustomError extends Error {
			constructor(...info) {
				let message = template;
				for (const value of info) {
					message = message.replace("%{}", value);
				}
				super(message);
				this.name = new.target.name || "CustomError";
				this.statusCode = statusCode;
				Error.captureStackTrace(this, this.constructor);
			}
		};
	}
}

export class DeniedWorldAccessError extends (new ErrorBuilder(`You don't have access to edit world '%{}'.`, 401).build()) {}
export class WorldNotFoundError extends (new ErrorBuilder(`World '%{}' does not exist.`, 404).build()) {}
export class BodyContentWrongTypeError extends (new ErrorBuilder(`Content is not a %{}.`, 400).build()) {}
export class BodyContentNotFoundError extends (new ErrorBuilder(`No content.`, 404).build()) {}
export class BodyContentTooLongError extends (new ErrorBuilder(`Content length is above %{}.`, 400).build()) {}