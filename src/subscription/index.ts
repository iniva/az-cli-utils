import inquirer from 'inquirer'
import chalk from 'chalk'

import { getCurrentSubscription } from './commands/get-current-subscription.command.js'
import { getUserSubscriptions } from './commands/get-user-subscription.command.js'
import { setSubscription } from './commands/set-subscription.command.js'

const main = async () => {
  console.log(chalk.cyan(`Fetching subscription details`))

  const currentSubscription = await getCurrentSubscription()
  const userSubscriptions = await getUserSubscriptions()

  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'change_subscription',
      message: `Using ${chalk.green.underline(
        currentSubscription.name,
      )}. Do you want to change it?`,
      default: false,
    },
    {
      when(answers) {
        return answers.change_subscription
      },
      type: 'list',
      name: 'subscription',
      message: 'Choose a subscription',
      choices: Object.keys(userSubscriptions)
        .filter((subscription) => subscription !== currentSubscription.name)
        .map((subscription) => {
          return {
            name: subscription,
            value: subscription,
          }
        }),
    },
  ])

  if (answers.change_subscription) {
    console.log(
      chalk.cyan(
        `Setting the subscription to ${chalk.greenBright.underline(answers.subscription)}`,
      ),
    )

    await setSubscription(answers.subscription)
  }
}

export default main
