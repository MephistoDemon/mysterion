// @flow

type WindowSizeConfig = {
  width: number,
  height: number
}

type MysterionWindowsConfig = {
  terms: WindowSizeConfig,
  app: WindowSizeConfig
}

type MysterionConfig = {
  // Application root directory
  contentsDirectory: string,
  // User data directory. This should store logs, terms and conditions file, etc.
  userDataDirectory: string,
  // Runtime/working directory, used for storing temp files
  runtimeDirectory: string,
  // Static file directory
  staticDirectory: string,
  // Window configuration
  windows: MysterionWindowsConfig
}

export type {MysterionConfig, MysterionWindowsConfig, WindowSizeConfig}
