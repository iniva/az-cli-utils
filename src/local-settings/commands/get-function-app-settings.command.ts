import chalk from 'chalk'
import { Presets, SingleBar } from 'cli-progress'

import { runCommand } from '../../utils/shell.util.js'
import { FunctionAppDetails } from '../../function-apps/types.js'
import { LocalSettings, RawSetting } from '../types.js'
import { writeLocalSettings } from '../utils.js'

export const getFunctionAppSettings = async (
  subscription: string,
  functionApp: FunctionAppDetails,
): Promise<void> => {
  const { stdout } = await runCommand(
    `az functionapp config appsettings list --name ${functionApp.name} --resource-group ${functionApp.resourceGroup} | jq`,
  )
  const rawSettings: RawSetting[] = JSON.parse(stdout)
  const settings: LocalSettings = {
    Subscription: subscription,
    FunctionApp: functionApp.name,
    Encrypted: true,
    Values: {},
  }

  rawSettings.map((rawSetting) => {
    settings.Values[rawSetting.name] = rawSetting.value
  })

  writeLocalSettings(settings)

  await decryptSecrets(settings)
}

export const decryptSecrets = async (localSettings: LocalSettings): Promise<void> => {
  console.log(chalk.yellow(`Decrypting secrets`))

  const secretList = Object.entries(localSettings.Values).filter(([_key, secret]) =>
    secret.startsWith('@'),
  )
  const progressBar = new SingleBar(
    {
      format: `Decryption |${chalk.cyan('{bar}')}| {percentage}% || {value}/{total} Secrets`,
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
    },
    Presets.shades_classic,
  )

  progressBar.start(secretList.length, 0)

  for (const [key, secret] of secretList) {
    progressBar.increment()
    const keyvaultUrlMatch = secret.match(/(https?:\/\/[^\s]+)/)
    const keyvaultUrl = new URL(keyvaultUrlMatch![0].slice(0, -1)) // remove last ")"
    const keyvaultName = keyvaultUrl.host.split('.').shift()
    const secretName = keyvaultUrl.href.split('/')[4]

    const { stdout: secretContent } = await runCommand(
      `az keyvault secret show --vault-name "${keyvaultName}" -n "${secretName}" | jq`,
    )
    const secretDetails = JSON.parse(secretContent)

    localSettings.Values[key] = secretDetails.value
  }

  progressBar.stop()

  localSettings.Encrypted = false

  writeLocalSettings(localSettings)
}
