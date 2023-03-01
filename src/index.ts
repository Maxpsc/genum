import { existsSync, readFileSync, readJSONSync, writeFileSync } from 'fs-extra'
import path from 'path'
import prettier from 'prettier'
import { logger } from 'og-toolkit'
import { ConfigItem } from './types'

function upperFirstString(name: string): string {
  return name.slice(0, 1).toUpperCase() + name.slice(1)
}

export const defaultTemplateName = 'genum-config.json'

export function createTemplate(dir: string) {
  const templateFile = readFileSync(path.resolve(__dirname, '../bin/template.json'))
  const targetDir = path.resolve(process.cwd(), dir)
  writeFileSync(path.resolve(targetDir, defaultTemplateName), templateFile)
}

export function run(options: { config: string; dir: string }) {
  const { config, dir } = options

  const configPath = path.resolve(process.cwd(), config)
  const prettierPath = path.resolve(process.cwd(), '.prettierrc.js')

  if (!existsSync(configPath)) {
    logger.error('Genum Config which you can run [genum init] to create is not exist.')
    process.exit(1)
  }

  const originalData: Record<string, ConfigItem[]> = readJSONSync(configPath)
  const prettierConfig = existsSync(prettierPath) ? require(prettierPath) : undefined

  let finallyCode = ''

  for (const dataKey in originalData) {
    const [name, description] = dataKey.split('-')

    const enumName = upperFirstString(name + 'Enum')
    const mapName = name + 'Map'
    const listName = name + 'List'

    let enumTmp = `
    ${description ? `/** ${description}枚举定义 */` : ''}
    export enum ${enumName} {`

    let mapTmp = `
    ${description ? `/** ${description}Map */` : ''}
    export const ${mapName} = {`

    let listTmp = `
    ${description ? `/** ${description}List */` : ''}
    export const ${listName} = [`

    originalData[dataKey].forEach(({ label, value, key, desc }) => {
      enumTmp += `
      /** ${desc || label} */
      ${key} = ${typeof value === 'number' ? value : `'${value || key}'`},`

      mapTmp += `[${enumName}.${key}]: '${label}',`

      listTmp += `{
          label: '${label}',
          value: ${enumName}.${key}
      },`
    })

    enumTmp += `}`
    mapTmp += '}'
    listTmp += ']'

    const content = enumTmp + '\n' + mapTmp + '\n' + listTmp

    finallyCode += content + '\n'
  }

  if (prettierConfig) {
    logger.info('Prettier is applied.')
  }

  writeFileSync(
    path.resolve(process.cwd(), dir, 'genum-data.ts'),
    prettierConfig
      ? prettier.format(finallyCode, {
          ...prettierConfig,
          parser: 'typescript',
        })
      : finallyCode
  )
  logger.done('Generate enum file completed~')
}
