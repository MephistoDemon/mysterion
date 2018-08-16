/*
 * Copyright (C) 2017 The "MysteriumNetwork/mysterion" Authors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// @flow
import type { Container } from '../../../app/di'
import Vue from 'vue'
import axios from 'axios'
import App from '../../App'
import routerFactory from '../../router/factory'
import storeFactory from '../../store/factory'
import mainFactory from '../../store/modules/main'
import identityFactory from '../../store/modules/identity'
import connectionFactory, { actionsFactory } from '../../store/modules/connection'
import errors from '../../store/modules/errors'
import terms from '../../store/modules/terms'
import clientProcess from '../../store/modules/clientProcess'

function bootstrap (container: Container) {
  container.service(
    'vue-application',
    [],
    () => {
      if (!process.env.IS_WEB) {
        Vue.use(require('vue-electron'))
      }
      Vue.http = Vue.prototype.$http = axios
      Vue.config.productionTip = false

      return new Vue({
        components: { App },
        router: container.get('vue-router'),
        store: container.get('vue-store'),
        template: '<App/>',
        el: '#app'
      })
    }
  )

  container.service(
    'vue-router',
    ['vue-store'],
    (store) => {
      return routerFactory(store)
    }
  )

  container.service(
    'vue-store',
    [
      'vue-store.main',
      'vue-store.identity',
      'vue-store.connection',
      'vue-store.errors',
      'vue-store.terms',
      'vue-store.clientProcess'
    ],
    (main, identity, connection, errors, terms, clientProcess) => {
      return storeFactory({
        main,
        identity,
        connection,
        errors,
        terms,
        clientProcess
      })
    }
  )
  container.service(
    'vue-store.main',
    ['tequilapiClient'],
    (tequilapiClient) => mainFactory(tequilapiClient)
  )
  container.service(
    'vue-store.identity',
    ['tequilapiClient'],
    (tequilapiClient) => identityFactory(tequilapiClient, container)
  )
  container.service(
    'vue-store.connection',
    ['vue-store.connection.actions'],
    (actions) => connectionFactory(actions)
  )
  container.service(
    'vue-store.connection.actions',
    ['tequilapiClient', 'rendererCommunication', 'eventSender', 'bugReporter'],
    (tequilapiClient, rendererCommunication, eventSender, bugReporter) => {
      return actionsFactory(tequilapiClient, rendererCommunication, eventSender, bugReporter)
    }
  )
  container.constant('vue-store.errors', errors)
  container.constant('vue-store.terms', terms)
  container.constant('vue-store.clientProcess', clientProcess)
}

export default bootstrap
