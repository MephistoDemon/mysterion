import http from 'http'

class Process {
  start () {
    // hack to spawn mysterium_client before the window is rendered
    http.get('http://127.0.0.1:4050', function () {})
  }
}

export default Process
