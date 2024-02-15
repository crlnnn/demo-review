const inquirer = require('inquirer')
const { join } = require('path')
const { exec } = require('child_process')

const environmentOptions = ['cz', 'sk', 'pl', 'it', 'ro']

const args = process.argv.slice(2)
let environmentArg

if (args.length > 0) {
  environmentArg = args[0]
}

const run = (environment, mode) => {
  console.group('Starting cypress')
  console.log('Mode:', mode)
  console.log('environment:', environment)

  const cypressPath = join(__dirname, 'node_modules/.bin/cypress')
  const crossEnvPath = join(__dirname, 'node_modules/.bin/cross-env')
  let command

  if (mode === 'open') {
    command = `"${cypressPath}" open --env configEnv=${environment}`
  } else if (mode === 'run') {
    command = `"${cypressPath}" run --env configEnv=${environment} --browser chrome`
  } else {
    console.log('Invalid mode')
    return
  }

  console.log('Command:', command)
  const childProcess = exec(
    `"${crossEnvPath}" ${command}`,
    (error, stdout, stderr) => {
      console.log(`stdout: ${stdout}`)
      console.log(`stderr: ${stderr}`)
      if (error !== null) {
        console.log(`exec error: ${error}`)
      }
    }
  )

  childProcess.stdout.on('data', (data) => {
    console.log(data)
  })

  childProcess.stderr.on('data', (data) => {
    console.error(data)
  })

  childProcess.on('close', (code) => {
    console.log(`Cypress process exited with code ${code}`)
  })

  console.groupEnd()
  console.log(
    `
        ／l、   Meeow!
      （ﾟ､ ｡ ７
        l  ~ヽ
        じしf_,)ノ
      `
  )
  console.log(`---------------`)
}

const questions = [
  {
    type: 'list',
    choices: ['open', 'run'],
    name: 'mode',
    message: 'Would you like to open or run your tests?',
    default: 'open',
  },
]

if (!environmentArg) {
  questions.push({
    type: 'list',
    choices: environmentOptions,
    name: 'environment',
    message: 'Select the environment:',
  })
}

inquirer.prompt(questions).then((answers) => {
  const environment = environmentArg || answers.environment
  run(environment, answers.mode)
})
