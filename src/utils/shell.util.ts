import { promisify } from 'node:util'
import { exec } from 'node:child_process'

const execPromise = promisify(exec)

export const runCommand = async (command: string) => {
  const { stdout, stderr } = await execPromise(command)
  if (isStdError(stderr)) {
    throw stderr
  }

  return {
    stdout,
    stderr,
  }
}

const isStdError = (err: any): err is { stderr: string } => {
  return typeof err.stderr === 'string'
}
