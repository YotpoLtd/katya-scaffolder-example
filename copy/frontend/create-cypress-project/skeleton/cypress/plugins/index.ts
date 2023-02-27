import * as dotenv from 'dotenv'
import { CypressEnvConfig } from '../support'

// injects content of .env file into process.env
dotenv.config()

module.exports = (on, config: { env: CypressEnvConfig }) => {
  config.env.username = process.env.USERNAME
  config.env.password = process.env.PASSWORD

  return config
}
