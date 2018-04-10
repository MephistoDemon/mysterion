import containerFactory from './container'
import containerBootstrap from './bootstrap'

const container = containerFactory()
containerBootstrap(container)

export default container
