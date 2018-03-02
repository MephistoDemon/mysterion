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
    stats: {}
  }

  it('renders and displays stats', () => {
    const vm = mount(initialConnectionState)
    const els = vm.$el.querySelectorAll('.stats__value')
    expect(els[0].textContent).to.eql('--:--:--')
    expect(els[1].textContent).to.eql('-')
    expect(els[2].textContent).to.eql('-')
  })

  it('displays stats formatting', () => {
    const vm = mount({
      stats: {
        duration: 13325,
        bytesReceived: 1232133, // 1.17505 MB
        bytesSent: 123321 // 0.117608 MB
      }
    })
    const els = vm.$el.querySelectorAll('.stats__value')
    expect(els[0].textContent).to.eql('03:42:05')
    expect(els[1].textContent).to.eql('1.23')
    expect(els[2].textContent).to.eql('123.32')
    const unitEls = vm.$el.querySelectorAll('.stats__unit')
    expect(unitEls[1].textContent).to.eql('MB')
    expect(unitEls[2].textContent).to.eql('kB')
  })
})
