// @flow

type ClientConfig = {
  /**
   * 'mysterium_client' binary path
   */
  clientBin: string,

  /**
   * 'mysterium_client' configuration files directory e.g. openvpn DNS resolver script
   */
  configDir: string,

  /**
   * 'openvpn' binary path
   */
  dataDir: string,

  /**
   * User data directory for 'mysterium_client' data, etc.
   */
  openVPNBin: string,

  /**
   * Runtime/working directory, used for storing temp files
   */
  runtimeDir: string,

  /**
   * Directory to store 'mysterium_client' logs
   */
  logDir: string,

  /**
   * Port on which to launch Tequilapi requests
   */
  tequilapiPort: number
}

export type {ClientConfig}
