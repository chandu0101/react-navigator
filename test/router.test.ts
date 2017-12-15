import { RouterConfig } from '../src/routerConfig'
import { Router, RouterScreenComponent } from '../src/routerComponents'
import { render } from 'react-dom'

import createMemoryHistory from 'history/createMemoryHistory'
import { getScreenKey } from '../src/utils'
import { RouterCtrl } from '../src/routerCtrl'
import { Component, CElement, createElement } from 'react'
import { RouteNotFound, RouterScreenProps } from '../src/types'
import { History } from 'history'

export type SampleProps = Readonly<{}>
class SampleClass extends Component<SampleProps, null> {
  render() {
    return null
  }
  shouldComponentUpdate(nextProps: SampleProps) {
    return nextProps !== this.props
  }
}
export function Sample(props: SampleProps): CElement<SampleProps, SampleClass> {
  return createElement(SampleClass, props)
}

const APP_ID = 'app'

let navigationCtrl: RouterCtrl

class HomeScreen extends RouterScreenComponent<null, null, null> {
  render() {
    return 'Hello World'
  }
  static className = 'HomeScreen'
}

class SecondScreen extends RouterScreenComponent<null, null, null> {
  render() {
    return 'Second Screen'
  }
  static className = 'SecondScreen'
}

type Params = { id: string }
class ThirdScreen extends RouterScreenComponent<Params, null, null> {
  params: Params
  constructor(props: RouterScreenProps) {
    super(props)
    this.params = props.navigation.currentRoute().params
  }
  render() {
    return `Third Screen id :${this.params.id}`
  }

  static className = 'ThirdScreen'
}

class Config extends RouterConfig {
  constructor(
    history: History = createMemoryHistory(),
    notfound: RouteNotFound = {
      page: getScreenKey(HomeScreen),
      action: 'REPLACE'
    }
  ) {
    super(history, notfound)
    this.registerScreen({ ctor: HomeScreen, path: '/' })
    this.registerScreen({ ctor: SecondScreen, path: 'second' })
    this.registerDynamicScreen({ ctor: ThirdScreen, path: 'user/:id' })
  }
  renderScene(navigation: RouterCtrl) {
    navigationCtrl = navigation // only for testing purpose
    return super.renderScene(navigation)
  }
}

const config = new Config()

describe('router', () => {
  beforeAll(() => {
    const app = document.createElement('div')
    app.setAttribute('id', APP_ID)
    document.body.appendChild(app)
    render(Router({ config: config }), document.getElementById(APP_ID))
  })

  test('Should Render Initial Screen', () => {
    expect(document.getElementById(APP_ID).textContent).toBe('Hello World')
  })

  test('Should navigate to secondScreen when using navigation', () => {
    navigationCtrl.navigate({ ctor: SecondScreen })
    expect(document.getElementById(APP_ID).textContent).toBe('Second Screen')
  })

  test('Should handle dynamic screens', () => {
    navigationCtrl.navigateWithParams({
      ctor: ThirdScreen,
      params: { id: '5' }
    })
    expect(document.getElementById(APP_ID).textContent).toBe(
      'Third Screen id :5'
    )
  })
})
