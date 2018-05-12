import { AnmationConfig } from './types'
import { Component, createElement, ReactElement } from 'react'

export interface Animation extends EventTarget {
  currentTime?: number
  effect: AnimationEffectReadOnly
  readonly finished: Promise<Animation>
  id: string
  readonly pending: boolean
  readonly playState: AnimationPlayState
  playbackRate: number
  readonly ready: Promise<Animation>
  startTime?: number
  timeline?: AnimationTimeLine
  oncancel: (e: any) => any
  onfinish: (e: any) => any
  cancel(): void
  finish(): void
  pause(): void
  play(): void
  reverse(): void
}

declare var Animation: {
  prototype: Animation
  new (): Animation
}

export interface AnimationTimeLine {
  readonly currentTime?: number
}
export interface DocumentTimeline extends AnimationTimeLine {}
export interface AnimationEffectReadOnly {
  readonly timing: AnimationEffectTimingReadOnly
  getComputedTiming(): ComputedTimingProperties
}

export type AnimationPlayState = 'idle' | 'running' | 'paused' | 'finished'

export type FillMode = 'none' | 'forwards' | 'backwards' | 'both' | 'auto'

export interface AnimationEffectTimingReadOnly {
  readonly delay: number
  readonly endDelay: number
  readonly fill: FillMode
  readonly iterationStart: number
  readonly iterations: number | 'Infinity'
  readonly duration: number | string
  readonly direction: PlaybackDirection
  readonly easing: string
}

export type PlaybackDirection =
  | 'normal'
  | 'reverse'
  | 'alternate'
  | 'alternate-reverse'

export interface ComputedTimingProperties
  extends AnimationEffectTimingProperties {
  endTime: number
  activeDuration: number
  localTime?: number
  progress?: number
  currentIteration?: number
}

export interface AnimationEffectTimingProperties {
  delay?: number
  endDelay?: number
  fill?: FillMode
  iterationStart?: number
  iterations?: number | 'Infinity'
  duration?: number | string
  direction?: PlaybackDirection
  easing?: string
}

export type IterationCompositeOperation = 'replace' | 'accumulate'

export type CompositeOperation = 'replace' | 'add' | 'accumulate'

export interface KeyframeEffectOptions extends AnimationEffectTimingProperties {
  iterationComposite?: IterationCompositeOperation
  composite?: CompositeOperation
}

export interface KeyframeAnimationOptions extends KeyframeEffectOptions {
  id?: string
}

export interface Animatable {
  animate: (
    keyframes: { [key: string]: any } | {}[],
    options?: number | KeyframeAnimationOptions
  ) => Animation

  getAnimations(): Animation[]
}

export const DEFAULT_AIMATION_OPTIONS: KeyframeAnimationOptions = {
  duration: 500,
  easing: 'ease',
  fill: 'both'
}

export const ANIMATE_FROM_LEFT: AnmationConfig = {
  keyframes: [{ transform: 'translate3D(-100%,0,0)' }, { transform: 'none' }],
  options: DEFAULT_AIMATION_OPTIONS
}

export const ANIMATE_FROM_RIGHT: AnmationConfig = {
  keyframes: [{ transform: 'translate3D(100%,0,0)' }, { transform: 'none' }],
  options: DEFAULT_AIMATION_OPTIONS
}

export const ANIMATE_FROM_UP: AnmationConfig = {
  keyframes: [{ transform: 'translate3D(0,-100%,0)' }, { transform: 'none' }],
  options: DEFAULT_AIMATION_OPTIONS
}

export const ANIMATE_FROM_DOWN: AnmationConfig = {
  keyframes: [{ transform: 'translate3D(0,100%,0)' }, { transform: 'none' }],
  options: DEFAULT_AIMATION_OPTIONS
}

export type AnimatorProps = Readonly<{
  config: AnmationConfig
  componentProps?: {}
  component?: any
}>

export class AnimatorClass extends Component<AnimatorProps, null> {
  render(): ReactElement<any> {
    const { config, componentProps, component } = this.props
    const type = component ? component : 'div'
    const p = componentProps
      ? componentProps
      : { style: { display: 'flex', flex: '1' } }
    const pwid = { ...p, id: 'Stacker' }
    return createElement(type, pwid)
  }

  componentDidUpdate() {
    const elem = document.getElementById('Stacker')
    if (elem) {
      ;((elem as any) as Animatable).animate(
        this.props.config.keyframes,
        this.props.config.options
      )
    }
  }
}
