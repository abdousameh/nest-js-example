export class UploadError extends Error {
  constructor(message: string) {
    super();
    const error = Error(message);

    // set immutable object properties
    Object.defineProperty(error, 'message', {
      get() {
        return message;
      },
    });
    Object.defineProperty(error, 'name', {
      get() {
        return 'UploadError';
      },
    });
    // capture where error occured
    Error.captureStackTrace(error, UploadError);
    return error;
  }
}
