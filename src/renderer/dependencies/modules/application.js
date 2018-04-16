// @flow
import {Container} from '../../../app/di'
import RendererCommunication from '../../../app/communication/renderer-communication'
import RendererMessageBus from '../../../app/communication/rendererMessageBus'

function bootstrap (container: Container) {
  container.service(
    'rendererCommunication',
    [],
    () => {
      return new RendererCommunication(new RendererMessageBus())
    }
  )
}

export default bootstrap
