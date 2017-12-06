import { PathUtils, Dictionary, Route, RouterAuth } from './types'
import { History, Action } from 'history'
import { RouterScreenProps, RouterScreenComponent } from './routerComponents'
import { Key } from 'path-to-regexp'
import pathToRegExp from 'path-to-regexp'
import { RouterCtrl } from './routerCtrl'
import { ReactElement, createElement } from 'react'

export abstract class RouterConfig extends PathUtils {
  _DONT_TOUCH_ME_staticRoutes: Dictionary<Route> = {}
  _DONT_TOUCH_ME_dynamicRoutes: Dictionary<Route> = {}
  _DONT_TOUCH_ME_auth: RouterAuth | null = null
  history: History

  registerScreen<
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

    this._DONT_TOUCH_ME_staticRoutes[ctor.name] = {
      path: p,
      title: title ? title : '',
      component: ctor,
      screenKey: ctor.name,
      secured: secured ? secured : true
    }
  }

  registerAuthScreen<
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
    const p = this.prefixSlashAndRemoveTrailingSlashes(path)

    this._DONT_TOUCH_ME_staticRoutes[ctor.name] = {
      path: p,
      title: title ? title : '',
      component: ctor,
      screenKey: ctor.name,
      secured: false
    }
    this._DONT_TOUCH_ME_auth = {
      screenKey: ctor.name,
      validator,
      action: action ? action : 'REPLACE'
    }
  }

  registerDynamicScreen<
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
    const p = this.prefixSlashAndRemoveTrailingSlashes(path)
    const keys: Key[] = []
    const pathRegExp = pathToRegExp(path, keys)
    const toPath = pathToRegExp.compile(p)
    this._DONT_TOUCH_ME_dynamicRoutes[ctor.name] = {
      path: p,
      component: ctor,
      screenKey: ctor.name,
      keys,
      pathRegExp,
      toPath,
      title: title ? title : '',
      secured: secured ? secured : true
    }
  }

  renderScene(navigation: RouterCtrl): ReactElement<any> {
    createElement(navigation.cu)
  }
}

function sample<T extends {}>(t: T): void {
  console.log('OM', t)
}

const s = sample({ id: 1 })
