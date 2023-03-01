#! /usr/bin/env node
'use strict'

const { program } = require('commander')
const chalk = require('chalk')

const { run, createTemplate, defaultTemplateName } = require('../dist/genum.cjs.js')

const pkg = require('../package.json')

if (pkg.private) {
  console.log(
    chalk.redBright(
      `This package ${pkg.name} has been marked as private, remove the 'private' field from the package.json to publish it.`
    )
  )
  process.exit(1)
}

program
  .command('init')
  .description('create a configure template in given directory')
  .option(
    '-d, --dir <directory>',
    'The Directory where the config template is generated',
    '.',
  )
  .action(opts => {
    createTemplate(opts.dir)
  })

program
  .command('gen')
  .description('generate enum')
  .option('-c, --config <config>', 'Config file', defaultTemplateName)
  .option('-d, --dir <directory>', 'The Directory where the template is generated', '.')
  .action(opts => {
    run(opts)
  })

program
  .version(pkg.version, '-v, --version', 'Output the current version')

// add some useful info on help
program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.cyan(`genum <command> --help`)} for detailed usage of given command.`)
  console.log()
})

program.commands.forEach(c => c.on('--help', () => console.log()))

enhanceErrorMessages('missingArgument', argName => {
  return `Missing required argument ${chalk.yellow(`<${argName}>`)}.`
})

enhanceErrorMessages('unknownOption', optionName => {
  return `Unknown option ${chalk.yellow(optionName)}.`
})

enhanceErrorMessages('optionMissingArgument', (option, flag) => {
  return (
    `Missing required argument for option ${chalk.yellow(option.flags)}` +
    (flag ? `, got ${chalk.yellow(flag)}` : ``)
  )
})

program.parse(process.argv)

function enhanceErrorMessages(methodName, log) {
  program.Command.prototype[methodName] = function (...args) {
    if (methodName === 'unknownOption' && this._allowUnknownOption) {
      return
    }

    this.outputHelp()

    console.log(`  ` + chalk.red(log(...args)))
    console.log()
    process.exit(1)
  }
}

