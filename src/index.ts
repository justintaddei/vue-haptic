import { PluginObject } from 'vue/types/plugin'
import { HapticPattern, IGlobalHapticOptions } from './types'
import getPattern from './utils/getPattern'
import getTrigger from './utils/getTrigger'
import './utils/polyfill'
import { warn } from './utils/warn'

/**
 * A WeekMap used to store the haptic pattern of a given
 * element. We use a WeekMap here because if we used a regular Map
 * object, it would hold the element we're using as a key in memory
 */
const patternMap = new WeakMap<HTMLElement, HapticPattern>()

export default {
  install(Vue, globalOptions: IGlobalHapticOptions) {
    warn(
      typeof globalOptions === 'undefined' ||
        typeof globalOptions.patterns !== 'object' ||
        (typeof globalOptions.patterns === 'object' && Object.keys(globalOptions.patterns).length === 0),
      `You must provide at least one pattern. See: https://github.com/justintaddei/vue-haptic#pattern-presets for more info.`
    )

    // Set component-level methods
    Vue.prototype.$haptics = {
      /**
       * Access to global patterns object
       */
      patterns: globalOptions.patterns,

      /**
       * Disable or enable haptics globally
       */
      get disabled(): boolean {
        return Boolean(globalOptions?.disabled)
      },
      set disabled(disabled: boolean) {
        globalOptions.disabled = disabled
      },

      /**
       * Cancel any currently running haptics
       */
      cancel() {
        navigator.vibrate(0)
      }
    }

    Vue.directive('haptic', {
      bind(el, binding, vNode) {
        const trigger = getTrigger(binding, globalOptions)

        patternMap.set(el, getPattern(binding, globalOptions))

        const vibrate = (pattern?: HapticPattern) => {
          if (globalOptions.disabled) return
          return navigator.vibrate(pattern ?? patternMap.get(el)!)
        }

        if (typeof trigger === 'string') {
          if (vNode.componentInstance) {
            vNode.componentInstance.$on(trigger, () => vibrate())
          } else {
            el.addEventListener(trigger, () => vibrate())
          }
        } else {
          trigger((pattern) => {
            if (globalOptions.disabled) return

            if (!pattern) return vibrate()

            if (typeof pattern === 'string') {
              warn(!globalOptions.patterns[pattern], `Pattern "${pattern}" does not exist.`)
              return vibrate(globalOptions.patterns[pattern])
            }

            if (typeof pattern === 'number' || pattern instanceof Array) vibrate(pattern)

            warn(`The pattern must be undefined or of type number, number[], or string. Received ${typeof pattern}`)
          }, el)
        }
      },
      update(el, binding) {
        const pattern = getPattern(binding, globalOptions)
        patternMap.set(el, pattern)
      }
    })
  }
} as PluginObject<IGlobalHapticOptions>
