// @flow
import {Container} from '../../../app/di'
import RendererCommunication from '../../../app/communication/renderer-communication'
import RendererMessageBus from '../../../app/communication/rendererMessageBus'
import ElkCollector from '../../../app/statistics/elk-collector'
import {AggregatingCollector} from '../../../app/statistics/aggregating-collector'
import {remote} from 'electron'
import type {ApplicationInfo} from '../../../app/statistics/events'
import {createEventFactory} from '../../../app/statistics/events'

function bootstrap (container: Container) {
  container.service(
    'rendererCommunication',
    [],
    () => {
      return new RendererCommunication(new RendererMessageBus())
    }
  )

  container.constant(
    'statsApplicationInfo',
    {
      name: 'mysterion_application',
      version: `${remote.getGlobal('__version')}(${remote.getGlobal('__buildNumber')})`
    }
  )
  container.service(
    'statsEventFactory',
    ['statsApplicationInfo'],
    (applicationInfo: ApplicationInfo) => {
      return createEventFactory(applicationInfo)
    }
  )
  container.service(
    'statsCollector',
    [],
    () => {
      const elkCollector = new ElkCollector('http://metrics.mysterium.network:8091')
      return new AggregatingCollector(elkCollector, 10)
    }
  )
}

export default bootstrap
