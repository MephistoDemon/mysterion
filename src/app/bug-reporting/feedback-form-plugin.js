// @flow
import {session as browserSession, BrowserWindow} from 'electron'
import type {Plugin} from '../../plugins'

import registerHeaderRules from '../window/requestHeaders'
import type {HeaderRule} from '../window/requestHeaders'

class FeedbackFormPlugin implements Plugin {
  _rule: HeaderRule

  constructor (rule: HeaderRule) {
    this._rule = rule
  }

  install (window: BrowserWindow) {
    window.once('ready-to-show', () => {
      registerHeaderRules(browserSession.defaultSession, this._rule)
    })
  }
}

export default FeedbackFormPlugin
