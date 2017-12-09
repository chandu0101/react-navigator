import { RouterConfig } from './routerConfig'
import { History, Action, Location, LocationDescriptorObject } from 'history'
import { Route, RouterScreenProps } from './types'
import { RouterScreenComponent } from './routerComponents'
import { getScreenKey, getBackupRoute } from './utils'

export class RouterCtrl {
  constructor(
    public readonly history: History,
    public readonly config: RouterConfig
  ) {}
  _DONT_TOUCH_ME_currentRoute: Route | null = null
  _DONT_TOUCH_ME_previousRoute?: Route

  currentRoute(): Route {
    return this._DONT_TOUCH_ME_currentRoute as Route
  }

  previousRoute(): Route | null {
    return this._DONT_TOUCH_ME_previousRoute
      ? this._DONT_TOUCH_ME_previousRoute
      : null
  }

  navigate<
    C extends new (props: RouterScreenProps) => RouterScreenComponent<
      null,
      any,
      any
    >
  >({
    ctor,
    action,
    search
  }: {
    ctor: C
    action?: Action
    search?: string
  }): void {
    this.navigateStatic({ ctor, action, search })
  }

  navigateLS<
    LocationState extends {},
    C extends new (props: RouterScreenProps) => RouterScreenComponent<
      null,
      LocationState,
      any
    >
  >({
    ctor,
    state,
    action,
    search
  }: {
    ctor: C
    state: LocationState
    action?: Action
    search?: string
  }): void {
    this.navigateStatic({ ctor, state, action, search })
  }

  navigateP<
    Params extends {},
    C extends new (props: RouterScreenProps) => RouterScreenComponent<
      Params,
      any,
      any
    >
  >({
    ctor,
    params,
    action,
    search
  }: {
    ctor: C
    params: Params
    action?: Action
    search?: string
  }): void {
    this.navigateDynamic({ ctor, params, action, search })
  }

  navigatePLS<
    Params extends {},
    LocationState extends {},
    C extends new (props: RouterScreenProps) => RouterScreenComponent<
      Params,
      LocationState,
      any
    >
  >({
    ctor,
    params,
    state,
    action,
    search
  }: {
    ctor: C
    params: Params
    state: LocationState
    action?: Action
    search?: string
  }): void {
    this.navigateDynamic({ ctor, params, state, action, search })
  }

  private navigateStatic<
    C extends new (props: RouterScreenProps) => RouterScreenComponent<
      null,
      any,
      any
    >
  >({
    ctor,
    action,
    search,
    state
  }: {
    ctor: C
    action?: Action
    search?: string
    state?: any
  }): void {
    const screenKey = getScreenKey(ctor)
    const route = this.config._DONT_TOUCH_ME_staticRoutes[screenKey]
    if (route) {
      const location: LocationDescriptorObject = {
        pathname: route.path,
        search: route.search,
        state: route.state
      }
      if (action && action === 'REPLACE') this.history.replace(location)
      else this.history.push(location)
    } else {
      this.handleNotFound()
    }
  }

  private navigateDynamic<
    Params extends {},
    C extends new (props: RouterScreenProps) => RouterScreenComponent<
      Params,
      any,
      any
    >
  >({
    ctor,
    params,
    action,
    search,
    state
  }: {
    ctor: C
    params: Params
    action?: Action
    search?: string
    state?: any
  }): void {
    const screenKey = getScreenKey(ctor)
    const route = this.config._DONT_TOUCH_ME_dynamicRoutes[screenKey]
    if (route) {
      const location: LocationDescriptorObject = {
        pathname: route.toPath ? route.toPath(params) : 'unknown',
        search: route.search,
        state: route.state
      }
      if (action && action === 'REPLACE') this.history.replace(location)
      else this.history.push(location)
    } else {
      this.handleNotFound()
    }
  }

  navigateBack(): void {
    this.history.goBack()
  }

  navigateForward(): void {
    this.history.goForward()
  }

  private handleNotFound(): void {
    const pathName = getBackupRoute(this.config).path
    this.config.notfound.action === 'REPLACE'
      ? this.history.replace(pathName)
      : this.history.push(pathName)
  }
}
