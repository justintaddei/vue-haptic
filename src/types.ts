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
}
