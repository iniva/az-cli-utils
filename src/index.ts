import inquirer from 'inquirer'
import chalk from 'chalk'

import localSettings from './local-settings/index.js'
import subscription from './subscription/index.js'

const app = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'command',
      message: 'What do you need to do?',
      choices: [
        {
          name: 'Handle your subscription',
          value: 'subscription',
        },
        {
          name: 'Fetch local.settings.json for a Function App',
          value: 'local-settings',
        },
      ],
      filter: (value) => {
        return value.toLowerCase()
      },
    },
  ])

  switch (true) {
    case answers.command === 'subscription':
      await subscription()
      break

    case answers.command === 'local-settings':
      await localSettings()
      break

    default:
      throw new Error(`Commands for ${chalk.underline(answers.command)} not yet supported`)
  }
}

app()
  .then(() => {
    console.log(chalk.green('Done'))
  })
  .catch((error) => {
    console.log(chalk.red('An error ocurred!'))
    console.error(error)
  })
