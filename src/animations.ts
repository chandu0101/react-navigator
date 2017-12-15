interface Animation extends EventTarget {
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

interface AnimationTimeLine {
  readonly currentTime?: number
}
interface DocumentTimeline extends AnimationTimeLine {}
interface AnimationEffectReadOnly {
  readonly timing: AnimationEffectTimingReadOnly
  getComputedTiming(): ComputedTimingProperties
}

type AnimationPlayState = 'idle' | 'running' | 'paused' | 'finished'

type FillMode = 'none' | 'forwards' | 'backwards' | 'both' | 'auto'

interface AnimationEffectTimingReadOnly {
  readonly delay: number
  readonly endDelay: number
  readonly fill: FillMode
  readonly iterationStart: number
  readonly iterations: number | 'Infinity'
  readonly duration: number | string
  readonly direction: PlaybackDirection
  readonly easing: string
}

type PlaybackDirection =
  | 'normal'
  | 'reverse'
  | 'alternate'
  | 'alternate-reverse'

interface ComputedTimingProperties extends AnimationEffectTimingProperties {
  endTime: number
  activeDuration: number
  localTime?: number
  progress?: number
  currentIteration?: number
}

interface AnimationEffectTimingProperties {
  delay?: number
  endDelay?: number
  fill?: FillMode
  iterationStart?: number
  iterations?: number | 'Infinity'
  duration?: number | string
  direction?: PlaybackDirection
  easing?: string
}

type IterationCompositeOperation = 'replace' | 'accumulate'

type CompositeOperation = 'replace' | 'add' | 'accumulate'

interface KeyframeEffectOptions extends AnimationEffectTimingProperties {
  iterationComposite?: IterationCompositeOperation
  composite?: CompositeOperation
}

interface KeyframeAnimationOptions extends KeyframeEffectOptions {
  id?: string
}

interface Animatable {
  animate: (
    keyframes: { [key: string]: any } | {}[],
    options?: number | KeyframeAnimationOptions
  ) => Animation

  getAnimations(): Animation[]
}
