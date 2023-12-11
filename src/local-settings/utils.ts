import { existsSync, readFileSync, writeFileSync } from 'node:fs'

import { LocalSettings } from './types.js'

const localSettingsFilePath = `${process.cwd()}/local.settings.json`

export const writeLocalSettings = (content: any): void => {
  writeFileSync(localSettingsFilePath, JSON.stringify(content, null, 2), {
    encoding: 'utf-8',
  })
}

export const readLocalSettings = (): LocalSettings | null => {
  if (!existsSync(localSettingsFilePath)) {
    return null
  }

  const content = readFileSync(localSettingsFilePath, { encoding: 'utf-8' })

  return JSON.parse(content)
}
