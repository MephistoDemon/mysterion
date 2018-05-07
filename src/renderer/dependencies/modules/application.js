// @flow
import {Container} from '../../../app/di'
import RendererCommunication from '../../../app/communication/renderer-communication'
import RendererMessageBus from '../../../app/communication/rendererMessageBus'
import ElkCollector from '../../../app/statistics/elk-collector'
import AggregatingCollector from '../../../app/statistics/aggregating-collector'
import NullCollector from '../../../app/statistics/null-collector'
import {remote} from 'electron'
import type {ApplicationInfo} from '../../../app/statistics/events'
import {createEventFactory} from '../../../app/statistics/events'

function bootstrap (container: Container) {
  const releaseID = remote.getGlobal('__releaseID')
  container.constant('releaseID', releaseID)

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
      version: releaseID
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
      if (process.env.NODE_ENV === 'production') {
        const elkCollector = new ElkCollector('http://metrics.mysterium.network:8091')
        return new AggregatingCollector(elkCollector, 10)
      }

      return new NullCollector()
    }
  )
}

export default bootstrap
