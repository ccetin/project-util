'use strict'

const path = require('path')
const BaseTask = require('./BaseTask')
const Util = require('../Util')

class InitTask extends BaseTask {
  constructor(...args) {
    super(...args)
  }

  validate() {
    const { options } = this.context
    const { remote, scope, title } = options
    let result = true
    if (!scope || !title || !remote) {
      result = false
    }
    return result
  }

  async execute(colors) {
    const { options, configName, config: defaultConfig } = this.context
    if (!defaultConfig) {
      const { path: directory, group, remote, scope, title } = options
      const groups = !group ? [] : group.split(',')
        .map( (g) => {
          const name = g.trim()
          const [ label, target ] = name.split(':')
          return target ? { name: label, path: target } : { name, path: name }
        })
      const config = { groups, remote, scope, title }
      const filename = path.join(path.resolve(directory || process.cwd()), configName)
      await Util.writeJsonFile(filename, config)
      this.logger.info(colors.yellow(`Project initialized:\n${JSON.stringify(config, null, 4)}`))
    } else {
      this.logger.info(colors.yellow('Project already initialized, use <config> <set> <key> <value> command'))
    }
  }

}

module.exports = InitTask
