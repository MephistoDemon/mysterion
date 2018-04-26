// @flow
import {Container} from '../../../app/di'
import RendererCommunication from '../../../app/communication/renderer-communication'
import RendererMessageBus from '../../../app/communication/rendererMessageBus'
import {ElkCollector, newEvent} from '../../../app/statistics/collector'
import {AggregatingCollector} from '../../../app/statistics/aggregating-collector'
import {remote} from 'electron'

function bootstrap (container: Container) {
  container.service(
    'rendererCommunication',
    [],
    () => {
      return new RendererCommunication(new RendererMessageBus())
    }
  )
  container.service('statsEventFactory', [], () => {
    const appVersion = `${remote.getGlobal('__version')}(${remote.getGlobal('__buildNumber')})`
    const appInfo = {
      name: 'mysterion_application',
      version: appVersion
    }
    const currentTime = () => new Date().getTime()
    return (name: string, context: Object) => newEvent(appInfo, name, currentTime, context)
  })
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
