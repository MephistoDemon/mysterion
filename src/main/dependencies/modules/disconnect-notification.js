// @flow

import type {Container} from '../../../app/di'
import Notification from '../../../app/notification/index'

function bootstrap (container: Container) {
  container.constant(
    'disconnectNotification',
    new Notification('Disconnected', 'You have been disconnected from VPN server')
  )
}

export default bootstrap
