// @flow

import type {Container} from '../../../app/di'
import DisconnectNotification from '../../../app/notification/disconnect'

function bootstrap (container: Container) {
  container.factory(
    'disconnectNotification',
    ['userSettings'],
    (userSettings) => {
      const disconnectNotification = new DisconnectNotification('Disconnected', 'You have been disconnected from VPN server')
      if (userSettings.showDisconnectNotifications === false) {
        disconnectNotification.disable()
      }
      return disconnectNotification
    }
  )
}

export default bootstrap
