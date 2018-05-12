import { RouterScreenComponent } from './routerComponents'
import { Location as HistoryLocation, Action } from 'history'
import { Navigation } from './routerCtrl'
import { RouterConfig } from './routerConfig'
import { Route } from './types'

export function removeTrailingForwardSlashes(value: string): string {
  return value.replace(/\/+$/, '')
}

export function getScreenKey<
  C extends new (...args: any[]) => RouterScreenComponent<any, any, any>
>(ctor: C): string {
  if (process.env.NODE_ENV !== 'production') {
    if (!(ctor as any).className) {
      throw new Error(
        `Please set static className property on class : ${ctor.name}`
      )
    }
  }
  return (ctor as any).className
}

export function getRouteFromLocation({
  loc,
  ctrl,
  action
}: {
  loc: HistoryLocation
  ctrl: Navigation
  action?: Action
}): Route {
  let result: Route
  let paramsLocal: any = undefined
  const pathname =
    loc.pathname == '/' ? '/' : removeTrailingForwardSlashes(loc.pathname)
  let staticRoute: Route | null = null
  for (let screenKey of Object.keys(ctrl.config._DONT_TOUCH_ME_staticRoutes)) {
    const r = ctrl.config._DONT_TOUCH_ME_staticRoutes[screenKey]
    if (r.path === pathname) {
      staticRoute = r
      break
    }
  }
  if (staticRoute) {
    result = staticRoute
  } else {
    let values: string[] = []
    let dynamicRoute: Route | null = null
    for (let screenKey of Object.keys(
      ctrl.config._DONT_TOUCH_ME_dynamicRoutes
    )) {
      const r = ctrl.config._DONT_TOUCH_ME_dynamicRoutes[screenKey]
      const m1 = r.pathRegExp ? r.pathRegExp.exec(pathname) : null
      if (m1) {
        dynamicRoute = r
        values = m1
        break
      }
    }
    if (dynamicRoute) {
      result = dynamicRoute
      paramsLocal = {}
      if (result.keys) {
        for (let i = 0; i < result.keys.length; i++) {
          paramsLocal[result.keys[i].name] = values[i + 1]
        }
      }
    } else {
      result = getBackupRoute(ctrl.config)
    }
  }
  return {
    ...result,
    action,
    search: loc.search,
    state: loc.state,
    params: paramsLocal
  }
}

export function getBackupRoute(config: RouterConfig): Route {
  return config._DONT_TOUCH_ME_staticRoutes[config.notfound.page]
    ? config._DONT_TOUCH_ME_staticRoutes[config.notfound.page]
    : config._DONT_TOUCH_ME_staticRoutes[
        Object.keys(config._DONT_TOUCH_ME_staticRoutes)[0]
      ]
}
