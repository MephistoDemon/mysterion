import dependencies from './dependencies'

const bugReporter = dependencies.get('bugReporter')

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
