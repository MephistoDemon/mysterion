// @flow
import {BrowserWindow} from 'electron'

export interface WindowPlugin {
  install (window: BrowserWindow): void
}

export interface Pluggable {
  registerPlugin (Plugin): void
}
