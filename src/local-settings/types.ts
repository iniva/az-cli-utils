export type RawSetting = {
  name: string
  slotSetting: boolean
  value: string
}

export type LocalSettings = {
  Subscription: string
  FunctionApp: string
  Encrypted: boolean
  Values: {
    [key: string]: string
  }
}
