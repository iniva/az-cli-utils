import { runCommand } from '../../utils/shell.util.js'
import { setDefaultSubscriptionByName } from '../utils.js'

export const setSubscription = async (subscriptionName: string): Promise<void> => {
  await runCommand(`az account set --subscription ${subscriptionName}`)

  setDefaultSubscriptionByName(subscriptionName)
}
