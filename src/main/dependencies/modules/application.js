// @flow
import type {Container} from '../../../app/di'

function bootstrap (container: Container) {
  container.constant('mysterionReleaseID', `${process.env.MYSTERION_VERSION}(${process.env.BUILD_NUMBER})`)
}

export default bootstrap
