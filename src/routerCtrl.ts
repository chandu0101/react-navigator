import { RouterConfig } from './routerConfig'
import { History } from 'history'
import { Route } from './types'

export class RouterCtrl {
  history: History
  config: RouterConfig
  constructor(history: History, config: RouterConfig) {
    this.history = history
    this.config = config
  }
  _DONT_TOUCH_ME_currentRoute: Route
  _DONT_TOUCH_ME_previousRoute?: Route
  currentRoute() {
    this._DONT_TOUCH_ME_currentRoute
  }
  previousRoute() {
    this._DONT_TOUCH_ME_previousRoute
  }
}
