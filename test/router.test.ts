import { RouterConfig } from '../src/routerConfig'
import { Router, RouterScreenComponent } from '../src/routerComponents'
import { render } from 'react-dom'

import createMemoryHistory from 'history/createMemoryHistory'
import { getScreenKey } from '../src/utils'

const APP_ID = 'app'

class HomeScreen extends RouterScreenComponent<null, null, null> {
  render() {
    return 'Hello World'
  }
  static className = 'HomeScreen'
}

class Config extends RouterConfig {
  constructor() {
    super()
    this.history = createMemoryHistory()
    this.registerScreen({ ctor: HomeScreen, path: '/' })
    this.notfound = { page: getScreenKey(HomeScreen), action: 'REPLACE' }
  }
}

const config = new Config()

describe('router', () => {
  beforeAll(() => {
    const app = document.createElement('div')
    app.setAttribute('id', APP_ID)
    document.body.appendChild(app)
  })

  test('TestIt', () => {
    render(Router({ config: config }), document.getElementById(APP_ID))
    expect(document.getElementById(APP_ID).textContent).toBe('Hello World')
  })
})
