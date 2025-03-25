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
				let message = `${new.target.name || "CustomError"}: ${template}`;
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

export class WrongTypeError extends (new ErrorBuilder(`%{} is not type of %{}`, 400).build()) {}
export class MissingPropertyError extends (new ErrorBuilder(`%{} is missing '%{}'`, 400).build()) {}
export class TooLongError extends (new ErrorBuilder(`%{} is above %{} characters.`, 400).build()) {}
export class JSONSyntaxError extends (new ErrorBuilder(`'%{}'`, 400).build()) {}
export class UnauthorizedError extends (new ErrorBuilder(`You are unauthorized to do this action.`, 401).build()) {}
export class WorldNotFoundError extends (new ErrorBuilder(`World '%{}' does not exist.`, 404).build()) {}
export class DeniedWorldAccessError extends (new ErrorBuilder(`You don't have access to edit world '%{}'.`, 401).build()) {}
export class FormatError extends (new ErrorBuilder(`%{} has the wrong format. Check documentation at https://legitimoose.net/api for more info.`, 400).build()) {}