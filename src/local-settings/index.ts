import inquirer from 'inquirer'
import chalk from 'chalk'

import subscription from '../subscription/index.js'
import { getFunctionAppSettings } from './commands/get-function-app-settings.command.js'
import { getFunctionAppList } from '../function-apps/commands/get-function-apps.command.js'
import { getCurrentSubscription } from '../subscription/commands/get-current-subscription.command.js'

const main = async () => {
  await subscription()

  const currentSubscription = await getCurrentSubscription()

  console.log(
    chalk.cyan(
      `Fetching Function Apps for ${chalk.green.underline(currentSubscription.name)} subscription`,
    ),
  )
  const functionApps = await getFunctionAppList()

  console.log(chalk.cyan(`Found ${chalk.green.underline(functionApps.length)} Function Apps`))
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'functionApp',
      message: 'Choose a Function App',
      choices: functionApps.map((functionApp) => {
        return {
          name: `${functionApp.name} - ${functionApp.state}`,
          value: functionApp,
        }
      }),
    },
  ])

  console.log(
    chalk.cyan(
      `Fetching local.settings.json for ${chalk.greenBright.underline(answers.functionApp.name)}`,
    ),
  )
  await getFunctionAppSettings(currentSubscription.name, answers.functionApp)

  console.log(
    chalk.cyan(
      `Done fetching local.settings.json for ${chalk.greenBright.underline(
        answers.functionApp.name,
      )}`,
    ),
  )
}

export default main
