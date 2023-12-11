import { runCommand } from '../../utils/shell.util.js'
import { SubscriptionDetails } from '../types.js'
import { writeLocalSubscriptions } from '../utils.js'

export const getUserSubscriptions = async (): Promise<SubscriptionDetails> => {
  const { stdout } = await runCommand('az account list | jq')
  const rawSubscriptions = JSON.parse(stdout)
  const subscriptions: SubscriptionDetails = {}

  rawSubscriptions.forEach((rawSub: any) => {
    subscriptions[rawSub.name] = rawSub
  })

  writeLocalSubscriptions(subscriptions)

  return subscriptions
}
