import { runCommand } from '../../utils/shell.util.js'
import { Subscription } from '../types.js'

export const getCurrentSubscription = async (): Promise<Subscription> => {
  const { stdout } = await runCommand('az account show | jq')
  const subscription: Subscription = JSON.parse(stdout)

  return subscription
}
