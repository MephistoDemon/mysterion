import Vue from 'vue'
import dependencies from './dependencies'
import bugReporter from '../app/bugReporting/bug-reporting'

bugReporter.renderer.install(Vue)

const application = dependencies.get('vue-application')
application.$mount()

window.addEventListener('unhandledrejection', (evt) => {
  bugReporter.renderer.captureException(evt.reason, {
    extra: evt.reason.response ? evt.reason.response.data : evt.reason
  })
})

const rendererCommunication = dependencies.get('rendererCommunication')
rendererCommunication.onMysteriumClientLog(({ level, data }) => {
  bugReporter.pushToLogCache(level, data)
})
