import { Location, Action } from 'history'

import { RegExpOptions, Key, PathFunction } from 'path-to-regexp'
import { removeTrailingForwardSlashes } from './utils'
import { RouterCtrl } from './routerCtrl'

export type RouterScreenKey = string

export type Dictionary<T> = { [key: string]: T }

export type Route = Readonly<{
  screenKey: RouterScreenKey
  path: string
  component: any
  title?: string
  secured?: boolean
  params?: any
  state?: any
  keys?: Key[]
  pathRegExp?: RegExp
  toPath?: PathFunction
  search?: string
  action?: string
}>

export type RouterAuth = Readonly<{
  screenKey: RouterScreenKey
  validator: () => boolean
  action: Action
}>

export abstract class PathUtils {
  prefixSlashAndRemoveTrailingSlashes(input: string): string {
    if (input.startsWith('/')) return removeTrailingForwardSlashes(input)
    else return '/' + removeTrailingForwardSlashes(input)
  }
}

export type RouteNotFound = Readonly<{ page: RouterScreenKey; action: Action }>

export type RouterScreenProps<P> = Readonly<{ navigation: RouterCtrl }>
