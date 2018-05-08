// @flow

import {app, Tray as ElectronTray, Menu} from 'electron'
import MainCommunication from '../../app/communication/main-communication'
import ProposalFetcher from '../../app/data-fetchers/proposal-fetcher'
import Window from '../../app/window'
import TrayMenuBuilder from './menu-builder'
import Tray from './tray'

const trayFactory = (
  communication: MainCommunication,
  proposalFetcher: ProposalFetcher,
  window: Window,
  iconPath: string
) => {
  const menuBuilder = new TrayMenuBuilder(
    () => app.quit(),
    () => window.show(),
    () => window.toggleDevTools(),
    communication
  )

  const trayFactory = (icon) => {
    return new ElectronTray(icon)
  }

  const templateBuilder = (items) => {
    return Menu.buildFromTemplate(items)
  }

  const tray = new Tray(trayFactory, templateBuilder, menuBuilder, iconPath)
  tray.build()

  communication.onConnectionStatusChange(({newStatus}) => tray.setStatus(newStatus))
  proposalFetcher.subscribe((proposals) => tray.setProposals(proposals))
}

export default trayFactory
