// @flow
import {Container} from '../../../app/di'
import RendererCommunication from '../../../app/communication/renderer-communication'
import RendererMessageBus from '../../../app/communication/rendererMessageBus'
import {ElkCollector} from '../../../libraries/statistics/collector'
import {AggregatingCollector} from '../../../libraries/statistics/aggregating-collector'

function bootstrap (container: Container) {
  container.service(
    'rendererCommunication',
    [],
    () => {
      return new RendererCommunication(new RendererMessageBus())
    }
  )
  container.service(
    'statsCollector',
    [],
    () => {
      let elkCollector = new ElkCollector('http://metrics.mysterium.network:8091')
      return new AggregatingCollector(elkCollector, 10)
    }
  )
}

export default bootstrap
