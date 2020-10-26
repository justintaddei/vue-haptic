/**
 * A haptic vibration pattern
 */
export type HapticPattern = number | number[]

/**
 * A function defined by the user of the plugin
 * to setup a custom trigger for haptic feedback.
 */
export type HapticTriggerFunction = (activator: (pattern?: HapticPattern | string) => void, el: HTMLElement) => void
/**
 * A haptic vibration pattern
 */
export type HapticTrigger = string | HapticTriggerFunction
/**
 * Global Haptic Options
 */
export interface IGlobalHapticOptions {
  /**
   * Used define patterns that can be used
   * as the argument of the v-haptic directive
   */
  patterns: {
    [name: string]: HapticPattern
  }
  /**
   * Used to disable haptics globally
   */
  disabled?: boolean
  /**
   * Used to change the default trigger
   * to something other than "pointerdown"
   */
  defaultHapticTrigger?: string
  /**
   * The period (in milliseconds) after the haptics are triggered and before the haptics actually play,
   * during which the haptics will be canceled if the user moves their figure,
   * or otherwise causes a `pointercancel` or `touchcancel` event to fire (i.e. touching an element while scrolling will not result in haptic feedback).
   *
   * @note
   * Only applicable when the haptic trigger is either `"pointerdown"` or `"touchstart"`
   *
   * @default 75
   */
  cancellationPeriod: number
}
