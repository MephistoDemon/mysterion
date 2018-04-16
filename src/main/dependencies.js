// @flow
import type {Container} from '../app/di/container'
import JpexContainer from '../app/di/container'

/**
 * Bootstraps all application dependencies into DI container
 */
function bootstrap (): Container {
  return new JpexContainer()
}

export {bootstrap}
export default bootstrap()
