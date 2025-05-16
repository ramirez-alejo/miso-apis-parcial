export class BusinessError extends Error {
  constructor(message: string, public type: BusinessErrorType) {
    super(message);
  }
}

export enum BusinessErrorType {
  NOT_FOUND = 'NOT_FOUND',
  PRECONDITION_FAILED = 'PRECONDITION_FAILED',
  BAD_REQUEST = 'BAD_REQUEST',
  CONFLICT = 'CONFLICT',
}
