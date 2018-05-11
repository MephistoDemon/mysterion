// @flow
import {BrowserWindow} from 'electron'
import type {WindowPlugin} from '../window/plugins'

import registerHeaderRules from '../window/requestHeaders'
import type {HeaderRule} from '../window/requestHeaders'

class FeedbackFormPlugin implements WindowPlugin {
  _rule: HeaderRule

  constructor (rule: HeaderRule) {
    this._rule = rule
  }

  install (window: BrowserWindow) {
    registerHeaderRules(window.webContents.session, this._rule)
  }
}

export default FeedbackFormPlugin
