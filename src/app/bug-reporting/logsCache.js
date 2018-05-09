import LimitedLinkedList from '../../libraries/limited-linked-list'
import {logLevels} from '../../libraries/mysterium-client'

const logsBuffer = {
  [logLevels.LOG]: new LimitedLinkedList(300),
  [logLevels.ERROR]: new LimitedLinkedList(300)
}

const pushToLogCache = (level, data) => {
  logsBuffer[level].insert(data)
}

const getLogCache = (level) => {
  return logsBuffer[level].toArray().reverse().join('\n')
}

export { pushToLogCache, getLogCache }
