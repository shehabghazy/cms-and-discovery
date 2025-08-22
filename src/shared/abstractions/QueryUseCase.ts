/**
 * Abstract base class for query use cases (operations that read data)
 * Queries return data without modifying state
 */
export abstract class QueryUseCase<TInput = void, TOutput = unknown> {
  /**
   * Execute the query with the given input
   * @param input - The query input parameters
   * @returns Promise that resolves with the query result
   */
  abstract execute(input: TInput): Promise<TOutput>;
}
