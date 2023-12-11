import { existsSync, readFileSync, writeFileSync } from 'node:fs'

import { Subscription, SubscriptionDetails } from './types.js'

const localSusbcriptionsFilePath = `${process.cwd()}/local.subscriptions.json`

export const writeLocalSubscriptions = (localSubscriptions: SubscriptionDetails): void => {
  writeFileSync(localSusbcriptionsFilePath, JSON.stringify(localSubscriptions, null, 2), {
    encoding: 'utf-8',
  })
}

export const readLocalSubscriptions = (): SubscriptionDetails | null => {
  if (!existsSync(localSusbcriptionsFilePath)) {
    return null
  }

  const content = readFileSync(localSusbcriptionsFilePath, { encoding: 'utf-8' })

  return JSON.parse(content)
}

export const getLocalSubscriptionByName = (name: string): Subscription | null => {
  const localSubscriptions = readLocalSubscriptions()

  if (localSubscriptions && name in localSubscriptions) {
    return localSubscriptions[name]
  }

  return null
}

export const setDefaultSubscriptionByName = (name: string): void => {
  const localSubscriptions = readLocalSubscriptions()

  if (localSubscriptions) {
    for (const subscriptionName of Object.keys(localSubscriptions)) {
      localSubscriptions[subscriptionName].isDefault = subscriptionName === name
    }

    writeLocalSubscriptions(localSubscriptions)
  }
}
