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
      bytesReceived: 0,
      bytesSent: 0,
      duration: 0
    }
  }

  it('renders and displays stats', () => {
    const vm = mount(initialConnectionState)
    const els = vm.$el.querySelectorAll('.stats__value')
    expect(els[0].textContent).to.contain('0')
    expect(els[1].textContent).to.contain('0')
    expect(els[2].textContent).to.contain('0')
  })
})

describe('statsDisplay Filter', () => {
  const vm = mount({
    stats: {
      duration: 103425,
      bytesReceived: 1232133, // 1.17505 MB
      bytesSent: 123321 // 0.117608 MB
    }
  })
  it('displays stats properly', () => {
    const els = vm.$el.querySelectorAll('.stats__value')
    expect(els[0].textContent).to.eql('28:43:45')
    expect(els[1].textContent).to.eql('1.18')
    expect(els[2].textContent).to.eql('0.12')
  })
})
