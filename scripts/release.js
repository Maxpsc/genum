const { release } = require('@eljs/release')
const { logger } = require('og-toolkit')

const { bin, run } = require('./utils')

const args = require('minimist')(process.argv.slice(2))
const skipTests = args.skipTests
const skipBuild = args.skipBuild

main().catch(err => {
  console.error(err)
  process.exit(1)
})

async function main() {
  const { stdout } = await run('git', ['status', '--porcelain'], {
    stdio: 'pipe',
  })

  if (stdout) {
    logger.printErrorAndExit('Your git status is not clean. Aborting.')
  }

  // run tests before release
  logger.step('Running tests ...')
  if (!skipTests) {
    await run(bin('jest'), ['--clearCache'])
    await run('npm', ['run', 'test:once', '--', '--bail', '--passWithNoTests'])
  } else {
    console.log(`(skipped)`)
  }

  // build package with types
  logger.step('Building package ...')
  if (!skipBuild) {
    await run('npm', ['run', 'build', '--', '--release'])
  } else {
    console.log(`(skipped)`)
  }

  release({
    checkGitStatus: false,
  })
}
