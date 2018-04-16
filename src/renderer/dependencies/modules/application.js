import RendererCommunication from '../../../app/communication/renderer-communication'
import RendererMessageBus from '../../../app/communication/rendererMessageBus'

function bootstrap (container) {
  container.service(
    'rendererCommunication',
    [],
    () => {
      return new RendererCommunication(new RendererMessageBus())
    }
  )
}

export default bootstrap
