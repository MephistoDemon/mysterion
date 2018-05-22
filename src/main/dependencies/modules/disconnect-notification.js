// @flow

import type {Container} from '../../../app/di'
import Notification from '../../../app/notification/index'

function bootstrap (container: Container) {
  container.factory(
    'disconnectNotification',
    ['userSettings'],
    (userSettings) => {
      const disconnectNotification = new Notification('Disconnected', 'You have been disconnected from VPN server')
      if (userSettings.showDisconnectNotifications === false) {
        disconnectNotification.disable()
      }
      return disconnectNotification
    }
  )
}

export default bootstrap
