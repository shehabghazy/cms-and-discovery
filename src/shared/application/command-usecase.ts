/**
 * Abstract base class for command use cases (operations that modify state)
 * 
 * Performance considerations:
 * - All operations are async by default
 */
export abstract class CommandUseCase<TInput = void, TOutput = void> {
  /**
   * Execute the command with the given input
   * @param input - The command input parameters
   * @returns Promise that resolves when the command is executed
   */
  abstract execute(input: TInput): Promise<TOutput>;


}
