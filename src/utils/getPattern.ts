import { DirectiveBinding } from 'vue/types/options'
import { HapticPattern, IGlobalHapticOptions } from '../types'
import { warn } from './warn'

export default function getPattern(
  { value, arg }: DirectiveBinding,
  globalOptions: IGlobalHapticOptions
): HapticPattern {
  let pattern: HapticPattern | string

  switch (typeof value) {
    case 'number':
    case 'string':
      pattern = value
      break
    case 'object':
      if (value instanceof Array) {
        pattern = value
        break
      }

      if (value.pattern) {
        pattern = value.pattern
        break
      }

    // `value` could also be a function so let this fall through to the default case.
    default:
      pattern = arg ?? 'default'
      break
  }

  const hapticPattern = typeof pattern === 'string' ? globalOptions.patterns[pattern] : pattern

  warn(!hapticPattern, `Pattern "${pattern}" does not exist.`)

  return hapticPattern
}
