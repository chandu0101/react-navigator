import {
  PathUtils,
  Dictionary,
  Route,
  RouterAuth,
  RouteNotFound
} from './types'
import { History, Action } from 'history'
import { RouterScreenProps, RouterScreenComponent } from './routerComponents'
import { Key } from 'path-to-regexp'
import pathToRegExp from 'path-to-regexp'
import { Navigation } from './routerCtrl'
import { ReactElement, createElement } from 'react'
import { getScreenKey } from './utils'

export abstract class RouterConfig extends PathUtils {
  readonly _DONT_TOUCH_ME_staticRoutes: Dictionary<Route> = {}
  readonly _DONT_TOUCH_ME_dynamicRoutes: Dictionary<Route> = {}
  _DONT_TOUCH_ME_auth: RouterAuth | null = null

  constructor(
    public readonly history: History,
    public readonly notfound: RouteNotFound
  ) {
    super()
  }
  protected registerScreen<
    C extends new (props: RouterScreenProps) => RouterScreenComponent<
      null,
      any,
      any
    >
  >({
    ctor,
    path,
    title,
    secured
  }: {
    ctor: C
    path: string
    title?: string
    secured?: boolean
  }): void {
    const p =
      path === '/' ? path : this.prefixSlashAndRemoveTrailingSlashes(path)
    const screenKey = getScreenKey(ctor)
    this._DONT_TOUCH_ME_staticRoutes[screenKey] = {
      path: p,
      title: title ? title : '',
      component: ctor,
      screenKey,
      secured: secured ? secured : true
    }
  }

  protected registerAuthScreen<
    C extends new (props: RouterScreenProps) => RouterScreenComponent<
      null,
      any,
      any
    >
  >({
    ctor,
    path,
    validator,
    action,
    title
  }: {
    ctor: C
    path: string
    validator: () => boolean
    action: Action
    title?: string
  }): void {
    const screenKey = getScreenKey(ctor)
    const p = this.prefixSlashAndRemoveTrailingSlashes(path)
    this._DONT_TOUCH_ME_staticRoutes[screenKey] = {
      path: p,
      title: title ? title : '',
      component: ctor,
      screenKey,
      secured: false
    }
    this._DONT_TOUCH_ME_auth = {
      screenKey: ctor.name,
      validator,
      action: action ? action : 'REPLACE'
    }
  }

  protected registerDynamicScreen<
    Params extends {},
    C extends new (props: RouterScreenProps) => RouterScreenComponent<
      Params,
      any,
      any
    >
  >({
    ctor,
    path,
    title,
    secured
  }: {
    ctor: C
    path: string
    title?: string
    secured?: boolean
  }): void {
    const screenKey = getScreenKey(ctor)
    const p = this.prefixSlashAndRemoveTrailingSlashes(path)
    const keys: Key[] = []
    const pathRegExp = pathToRegExp(p, keys)
    const toPath = pathToRegExp.compile(p)
    this._DONT_TOUCH_ME_dynamicRoutes[screenKey] = {
      path: p,
      component: ctor,
      screenKey,
      keys,
      pathRegExp,
      toPath,
      title: title ? title : '',
      secured: secured ? secured : true
    }
  }

  protected registerModule(moduleConfig: RouterModuleConfig) {
    for (let key of Object.keys(moduleConfig._DONT_TOUCH_ME_staticRoutes)) {
      this._DONT_TOUCH_ME_staticRoutes[key] =
        moduleConfig._DONT_TOUCH_ME_staticRoutes[key]
    }
    for (let key of Object.keys(moduleConfig._DONT_TOUCH_ME_dynamicRoutes)) {
      const route = moduleConfig._DONT_TOUCH_ME_dynamicRoutes[key]
      const keys: Key[] = []
      const pathRegExp = pathToRegExp(route.path, keys)
      const toPath = pathToRegExp.compile(route.path)
      this._DONT_TOUCH_ME_dynamicRoutes[key] = {
        ...route,
        keys,
        toPath,
        pathRegExp
      }
    }
    moduleConfig._DONT_TOUCH_ME_staticRoutes = {}
    moduleConfig._DONT_TOUCH_ME_dynamicRoutes = {}
  }

  renderScene(navigation: Navigation): ReactElement<any> {
    return createElement(navigation.currentRoute().component, { navigation })
  }
}

export abstract class RouterModuleConfig extends PathUtils {
  _DONT_TOUCH_ME_staticRoutes: Dictionary<Route> = {}
  _DONT_TOUCH_ME_dynamicRoutes: Dictionary<Route> = {}

  constructor(private moduleName: string) {
    super()
  }

  protected registerScreen<
    C extends new (props: RouterScreenProps) => RouterScreenComponent<
      null,
      any,
      any
    >
  >({
    ctor,
    path,
    title,
    secured
  }: {
    ctor: C
    path: string
    title?: string
    secured?: boolean
  }): void {
    const p =
      '/' + this.moduleName + this.prefixSlashAndRemoveTrailingSlashes(path)
    const screenKey = getScreenKey(ctor)
    this._DONT_TOUCH_ME_staticRoutes[screenKey] = {
      path: p,
      title: title ? title : '',
      component: ctor,
      screenKey,
      secured: secured ? secured : true
    }
  }

  protected registerDynamicScreen<
    Params extends {},
    C extends new (props: RouterScreenProps) => RouterScreenComponent<
      Params,
      any,
      any
    >
  >({
    ctor,
    path,
    title,
    secured
  }: {
    ctor: C
    path: string
    title?: string
    secured?: boolean
  }): void {
    const screenKey = getScreenKey(ctor)
    const p =
      this.prefixSlashAndRemoveTrailingSlashes(this.moduleName) +
      this.prefixSlashAndRemoveTrailingSlashes(path)
    this._DONT_TOUCH_ME_dynamicRoutes[screenKey] = {
      path: p,
      component: ctor,
      screenKey,
      title: title ? title : '',
      secured: secured ? secured : true
    }
  }

  protected registerModule(moduleConfig: RouterModuleConfig) {
    for (let key of Object.keys(moduleConfig._DONT_TOUCH_ME_staticRoutes)) {
      this._DONT_TOUCH_ME_staticRoutes[key] =
        moduleConfig._DONT_TOUCH_ME_staticRoutes[key]
    }
    for (let key of Object.keys(moduleConfig._DONT_TOUCH_ME_dynamicRoutes)) {
      const route = moduleConfig._DONT_TOUCH_ME_dynamicRoutes[key]
      const path =
        this.prefixSlashAndRemoveTrailingSlashes(this.moduleName) + route.path
      this._DONT_TOUCH_ME_dynamicRoutes[key] = { ...route, path }
    }
    moduleConfig._DONT_TOUCH_ME_staticRoutes = {}
    moduleConfig._DONT_TOUCH_ME_dynamicRoutes = {}
  }
}
