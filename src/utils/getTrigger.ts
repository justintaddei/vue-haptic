import { DirectiveBinding } from 'vue/types/options'
import { HapticTriggerFunction, IGlobalHapticOptions } from '../types'

export default function getTrigger(
  { value, modifiers }: DirectiveBinding,
  globalOptions: IGlobalHapticOptions
): string | HapticTriggerFunction {
  if (typeof value === 'function') return value
  if (typeof value === 'object' && value.trigger) return value.trigger

  return Object.keys(modifiers)[0] ?? globalOptions?.defaultHapticTrigger ?? 'pointerdown'
}
