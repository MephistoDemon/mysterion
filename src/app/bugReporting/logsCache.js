import LimitedLinkedList from '../../libraries/limited-linked-list'
import {logLevel} from '../../libraries/mysterium-client/index'

const logsBuffer = {
  [logLevel.LOG]: new LimitedLinkedList(300),
  [logLevel.ERROR]: new LimitedLinkedList(300)
}

const pushToLogCache = (level, data) => {
  logsBuffer[level].insert(data)
}

const getLogCache = (level) => {
  return logsBuffer[level].toArray().reverse().join('\n')
}

export { pushToLogCache, getLogCache }
