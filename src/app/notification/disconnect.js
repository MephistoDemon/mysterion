// @flow
import {Notification} from 'electron'
import type {ConnectionStatusChangeDTO} from '../communication/dto'
import ConnectionStatusEnum from '../../libraries/mysterium-tequilapi/dto/connection-status-enum'

type ConnectionStatusChangeTrigger = (ConnectionStatusChangeDTO) => void

class MystNotification {
  title: string
  subtitle: string
  closeButtonText: string = 'Gotcha'

  constructor (title: string, subtitle: string) {
    this.title = title
    this.subtitle = subtitle
  }
}

export default class DisconnectNotification extends MystNotification {
  isEnabled: boolean = true

  enable () {
    this.isEnabled = true
  }

  disable () {
    this.isEnabled = false
  }

  wait (onConnectionStatusChange: ConnectionStatusChangeTrigger): void {
    onConnectionStatusChange((status: ConnectionStatusChangeDTO) => {
      if (this.isEnabled) {
        if (status.newStatus === ConnectionStatusEnum.NOT_CONNECTED) {
          const n = new Notification({
            title: this.title,
            subtitle: this.subtitle,
            closeButtonText: this.closeButtonText
          })
          n.show()
        }
      }
    })
  }
}
