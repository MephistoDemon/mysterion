// @flow
import type from '../types'
import {isTimeoutError, hasHttpStatus, httpResponseCodes} from '../../../libraries/api/errors'
import messages from '../../../app/messages'
import bugReporter from '../../../app/bugReporting/bug-reporting'
import {FunctionLooper} from '../../../libraries/functionLooper'
import connectionStatus from '../../../libraries/api/connectionStatus'
import config from '@/config'
import {ConnectEventTracker, currentUserTime} from '../../../app/statistics/events-connection'
import RendererCommunication from '../../../app/communication/renderer-communication'
import {EventCollector as StatsCollector} from '../../../app/statistics/events'
import type {EventFactory as StatsEventsFactory} from '../../../app/statistics/events'

type ConnectionStore = {
  ip: ?string,
  status: string,
  statistics: Object,
  actionLoopers: Map<string,FunctionLooper>
}

class ActionLooper {
  action: string
  looper: FunctionLooper

  constructor (action: string, looper: FunctionLooper) {
    this.action = action
    this.looper = looper
  }
}

class ActionLooperStart {
  action: string
  threshold: number

  constructor (action: string, threshold: number) {
    this.action = action
    this.threshold = threshold
  }
}

const defaultStatistics = {
}

const state: ConnectionStore = {
  ip: null,
  status: connectionStatus.NOT_CONNECTED,
  statistics: defaultStatistics,
  actionLoopers: {}
}

const getters = {
  status: state => state.status,
  connection: state => state,
  ip: state => state.ip
}

const mutations = {
  [type.SET_CONNECTION_STATUS] (state: ConnectionStore, status: string) {
    state.status = status
  },
  [type.CONNECTION_STATISTICS] (state: ConnectionStore, statistics: Object) {
    state.statistics = statistics
  },
  [type.CONNECTION_IP] (state: ConnectionStore, ip: string) {
    state.ip = ip
  },
  [type.CONNECTION_STATISTICS_RESET] (state: ConnectionStore) {
    state.statistics = defaultStatistics
  },
  [type.SET_ACTION_LOOPER] (state: ConnectionStore, looper: ActionLooper) {
    state.actionLoopers[looper.action] = looper.looper
  },
  [type.REMOVE_ACTION_LOOPER] (state: ConnectionStore, action: string) {
    delete state.actionLoopers[action]
  }
}

function actionsFactory (
  tequilapi: Object,
  rendererCommunication: RendererCommunication,
  statsCollector: StatsCollector,
  statsEventsFactory: StatsEventsFactory
) {
  return {
    async [type.CONNECTION_IP] ({commit}) {
      try {
        const ip = await tequilapi.connection.ip(config.ipUpdateTimeout)
        commit(type.CONNECTION_IP, ip)
      } catch (err) {
        if (isTimeoutError(err) || hasHttpStatus(err, 503)) {
          return
        }
        bugReporter.renderer.captureException(err)
      }
    },
    [type.START_ACTION_LOOPING] ({dispatch, commit, state}, event: ActionLooperStart) {
      const currentLooper = state.actionLoopers[event.action]
      if (currentLooper) {
        console.log('Warning: requested to start looping action which is already looping: ' + event.action)
        return currentLooper
      }

      const looper = new FunctionLooper(() => dispatch(event.action), event.threshold)
      looper.start()

      commit(type.SET_ACTION_LOOPER, new ActionLooper(event.action, looper))
      return looper
    },
    async [type.STOP_ACTION_LOOPING] ({commit, state}, action: string) {
      const looper = state.actionLoopers[action]
      if (looper) {
        await looper.stop()
      }
      commit(type.REMOVE_ACTION_LOOPER, action)
    },
    async [type.FETCH_CONNECTION_STATUS] ({commit, dispatch}) {
      try {
        const res = await tequilapi.connection.status()
        await dispatch(type.SET_CONNECTION_STATUS, res.status)
      } catch (err) {
        commit(type.SHOW_ERROR, err)
      }
    },
    async [type.SET_CONNECTION_STATUS] ({commit, dispatch, state}, newStatus) {
      const oldStatus = state.status
      if (oldStatus === newStatus) {
        return
      }
      commit(type.SET_CONNECTION_STATUS, newStatus)
      rendererCommunication.sendConnectionStatusChange({oldStatus, newStatus})

      if (newStatus === connectionStatus.CONNECTED) {
        await dispatch(type.START_ACTION_LOOPING, new ActionLooperStart(type.CONNECTION_STATISTICS, config.statisticsUpdateThreshold))
      }
      if (oldStatus === connectionStatus.CONNECTED) {
        await dispatch(type.STOP_ACTION_LOOPING, type.CONNECTION_STATISTICS)
      }
    },
    async [type.CONNECTION_STATISTICS] ({commit}) {
      try {
        const statistics = await tequilapi.connection.statistics()
        commit(type.CONNECTION_STATISTICS, statistics)
      } catch (err) {
        commit(type.SHOW_ERROR, err)
      }
    },
    async [type.CONNECT] ({commit, dispatch, state}, connectionDetails) {
      let eventTracker = new ConnectEventTracker(statsCollector, currentUserTime, statsEventsFactory)
      eventTracker.connectStarted({
        consumerId: connectionDetails.consumerId,
        providerId: connectionDetails.providerId
      })
      const looper = state.actionLoopers[type.FETCH_CONNECTION_STATUS]
      if (looper) {
        await looper.stop()
      }
      await dispatch(type.SET_CONNECTION_STATUS, connectionStatus.CONNECTING)
      commit(type.CONNECTION_STATISTICS_RESET)
      try {
        await tequilapi.connection.connect(connectionDetails)
        eventTracker.connectEnded()
        commit(type.HIDE_ERROR)
      } catch (err) {
        const cancelConnectionCode = httpResponseCodes.CLIENT_CLOSED_REQUEST
        if (hasHttpStatus(err, cancelConnectionCode)) {
          eventTracker.connectCanceled()
          return
        }
        commit(type.SHOW_ERROR_MESSAGE, messages.connectFailed)
        let error = new Error('Connection to node failed.')
        error.original = err
        eventTracker.connectEnded(error.toString())
        throw error
      } finally {
        if (looper) {
          looper.start()
        }
      }
    },
    async [type.DISCONNECT] ({commit, dispatch}) {
      const looper = state.actionLoopers[type.FETCH_CONNECTION_STATUS]
      if (looper) {
        await looper.stop()
      }
      try {
        await dispatch(type.SET_CONNECTION_STATUS, connectionStatus.DISCONNECTING)
        let res = await tequilapi.connection.disconnect()
        dispatch(type.FETCH_CONNECTION_STATUS)
        dispatch(type.CONNECTION_IP)
        return res
      } catch (err) {
        commit(type.SHOW_ERROR, err)
        throw (err)
      } finally {
        if (looper) {
          looper.start()
        }
      }
    }
  }
}

function factory (actions: Object) {
  return {
    state,
    getters,
    mutations,
    actions,
  }
}

export {
  ActionLooper,
  ActionLooperStart,
  state,
  mutations,
  getters,
  actionsFactory
}
export default factory
