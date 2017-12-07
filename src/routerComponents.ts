import { Component, createElement, ReactElement, CElement } from 'react'
import { RouterCtrl } from './routerCtrl'
import { RouterConfig } from './routerConfig'
import { Location as HistoryLocation, Action } from 'history'
import { getRouteFromLocation } from './utils'
import { Route } from './types'

// Can't do import without .d.ts. See https://github.com/Microsoft/TypeScript/issues/15031
const PropTypes = require('prop-types')

export type RouterScreenProps = Readonly<{ navigation: RouterCtrl }>

export abstract class RouterScreenComponent<Params, S, LS> extends Component<
  RouterScreenProps,
  S
> {
  params?: Params
  locationState?: LS
  navigation: RouterCtrl = this.props.navigation
  static className: string
}

export const navigationContext = { navigation: PropTypes.object }

export type RouterContextProps = { ctrl: RouterCtrl }

export class RouterContext extends Component<RouterContextProps, {}> {
  render() {
    return this.props.ctrl.config.renderScene(this.props.ctrl)
  }
  getChildContext() {
    return { navigation: this.props.ctrl }
  }
  static childContextTypes = navigationContext
}

export type RouterProps = Readonly<{ config: RouterConfig }>

export class RouterClass extends Component<RouterProps, {}> {
  ctrl: RouterCtrl
  unlisten?: () => void

  componentWillMount() {
    const history = this.props.config.history
    this.ctrl = new RouterCtrl(history, this.props.config)
    this.unlisten = history.listen(
      (location: HistoryLocation, action: Action) => {
        this.handleAuthAndSetCurrentRoute({
          location,
          action,
          updateComponent: true
        })
      }
    )
    this.handleAuthAndSetCurrentRoute({
      location: history.location
    })
  }

  render(): ReactElement<any> {
    return createElement(RouterContext, { ctrl: this.ctrl })
  }

  handleAuthAndSetCurrentRoute({
    location,
    action,
    updateComponent
  }: {
    location: HistoryLocation
    action?: Action
    updateComponent?: boolean
  }): void {
    const route = getRouteFromLocation({
      loc: location,
      action,
      ctrl: this.ctrl
    })
    const isSecured = route.secured ? route.secured : true
    if (
      this.ctrl.config._DONT_TOUCH_ME_auth == null ||
      !isSecured ||
      this.ctrl.config._DONT_TOUCH_ME_auth.validator()
    ) {
      if (
        this.ctrl._DONT_TOUCH_ME_currentRoute &&
        this.ctrl._DONT_TOUCH_ME_currentRoute.action
      ) {
        this.ctrl._DONT_TOUCH_ME_previousRoute = this.ctrl._DONT_TOUCH_ME_currentRoute
      }
      this.ctrl._DONT_TOUCH_ME_currentRoute = route
      if (updateComponent) {
        this.forceUpdate()
      }
    } else {
      let loginRoute: Route | null = null
      for (let screenKey of Object.keys(
        this.ctrl.config._DONT_TOUCH_ME_staticRoutes
      )) {
        const r = this.ctrl.config._DONT_TOUCH_ME_staticRoutes[screenKey]
        if (screenKey === this.ctrl.config._DONT_TOUCH_ME_auth.screenKey) {
          loginRoute = r
          break
        }
      }
      if (loginRoute) {
        if (this.ctrl.config._DONT_TOUCH_ME_auth.action === 'REPLACE') {
          this.ctrl.config.history.replace(loginRoute.path)
        } else {
          this.ctrl.config.history.push(loginRoute.path)
        }
      }
    }
  }

  componentWillUnmount() {
    if (this.unlisten) this.unlisten()
  }
}

export function Router(props: RouterProps): CElement<RouterProps, RouterClass> {
  return createElement(RouterClass, props)
}
