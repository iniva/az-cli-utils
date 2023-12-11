import { emojify } from 'node-emoji'
import { runCommand } from '../../utils/shell.util.js'
import { FunctionAppDetails } from '../types.js'

export const getFunctionAppList = async (): Promise<FunctionAppDetails[]> => {
  const { stdout } = await runCommand('az functionapp list | jq')
  const rawList = JSON.parse(stdout)
  const list: FunctionAppDetails[] = rawList.map((functionApp: any) => {
    return {
      name: functionApp.name,
      state: stateWithEmoji(functionApp.state),
      resourceGroup: functionApp.resourceGroup,
    }
  })

  return list.sort((funcAppA, funcAppB) => funcAppA.name.localeCompare(funcAppB.name))
}

const stateWithEmoji = (state: string): string => {
  let emoji = `:white_check_mark:`

  if (state === 'Stopped') {
    emoji = ':x:'
  }

  return emojify(`${emoji} ${state}`)
}
