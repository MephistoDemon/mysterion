import dependencies from './dependencies'
import Vue from 'vue'

const bugReporter = dependencies.get('bugReporter')
const sentryURL = dependencies.get('sentryURL')
const releaseID = dependencies.get('releaseID')
bugReporter.install(sentryURL, Vue, releaseID)

const application = dependencies.get('vue-application')
application.$mount()

window.addEventListener('unhandledrejection', (evt) => {
  bugReporter.captureException(evt.reason, {
    extra: evt.reason.response ? evt.reason.response.data : evt.reason
  })
})

const rendererCommunication = dependencies.get('rendererCommunication')
rendererCommunication.onMysteriumClientLog(({ level, data }) => {
  bugReporter.pushToLogCache(level, data)
})
