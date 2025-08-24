// Search engine error classes

/**
 * Error thrown when search engine operations fail.
 */
export class SearchEngineError extends Error {
  constructor(
    message: string,
    public readonly operation: string,
    public readonly index?: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'SearchEngineError';
  }
}

/**
 * Error thrown when an index is not found.
 */
export class IndexNotFoundError extends SearchEngineError {
  constructor(index: string, cause?: Error) {
    super(`Index '${index}' not found`, 'index-lookup', index, cause);
    this.name = 'IndexNotFoundError';
  }
}

/**
 * Error thrown when a document is not found.
 */
export class DocumentNotFoundError extends SearchEngineError {
  constructor(id: string, index: string, cause?: Error) {
    super(`Document '${id}' not found in index '${index}'`, 'document-lookup', index, cause);
    this.name = 'DocumentNotFoundError';
  }
}
