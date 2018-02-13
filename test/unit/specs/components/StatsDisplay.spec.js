import Vue from 'vue'
import StatsDisplay from '../../../../src/renderer/components/StatsDisplay'

const mount = function (connection) {
  const Comp = new Vue({
    template: '<div><stats-display :connection="connection"/></div>',
    components: { 'stats-display': StatsDisplay },
    data: { connection: connection }
  })
  const vm = Comp.$mount()

  return vm
}

describe('StatsDisplay', () => {
  const initialConnectionState = {
    stats: {
      bytesReceived: '-;-',
      bytesSent: '@__@',
      duration: 'u.u'
    }
  }

  it('renders and displays stats', () => {
    const vm = mount(initialConnectionState)
    const els = vm.$el.querySelectorAll('.stats__value')
    expect(els[0].textContent).to.contain('u.u')
    expect(els[1].textContent).to.contain('-;-')
    expect(els[2].textContent).to.contain('@__@')
  })
})
