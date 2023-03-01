const { logger } = require('@eljs/release')
const { run } = require('./utils')

const args = require('minimist')(process.argv.slice(2))
const owners = args._

if (!owners.length) {
  logger.printErrorAndExit('please entry owner name.')
}

main()

async function main() {
  for (const owner of owners) {
    const pkg = require(`../package.json`)

    await run('npm', ['owner', 'add', owner, pkg.name])
    logger.done(`${owner} now has the owner permission of ${pkg.name}.`)
  }
}
