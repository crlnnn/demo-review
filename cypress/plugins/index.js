const fs = require('fs')

function initPlugin(on, config) {
  const envName = config.env.configEnv
  const configFile = JSON.parse(
    fs.readFileSync('cypress/env/localizationSettings.json', 'utf8')
  )

  if (configFile[envName]) {
    config.baseUrl = configFile[envName].e2e.baseUrl || config.baseUrl

    config.env = mergeDeep(config.env, configFile[envName].env)
  }

  return config
}

function mergeDeep(target, source) {
  if (typeof target == 'object' && typeof source == 'object') {
    for (const key in source) {
      if (source[key] instanceof Object) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }
  return target
}

module.exports = { initPlugin }
