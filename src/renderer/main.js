import Vue from 'vue'
import dependencies from './dependencies'
import bugReporter from '../app/bugReporting/bug-reporting'
import RendererCommunication from '../app/communication/renderer-communication'
import RendererMessageBus from '../app/communication/rendererMessageBus'

bugReporter.renderer.install(Vue)

const application = dependencies.get('vue-application')
application.$mount()

window.addEventListener('unhandledrejection', (evt) => {
  bugReporter.renderer.captureException(evt.reason, {
    extra: evt.reason.response ? evt.reason.response.data : evt.reason
  })
})

const rendererMessageBus = new RendererMessageBus()

const rendererCommunication = new RendererCommunication(rendererMessageBus)
rendererCommunication.onMysteriumClientLog(({ level, data }) => {
  bugReporter.pushToLogCache(level, data)
})
