export function warn(message: string): void
export function warn(condition: boolean, message: string): void
export function warn(conditionOrMessage: boolean | string, message?: string) {
  if (process.env.NODE_ENV === 'development')
    if (arguments.length === 1) console.error('[vue-haptic]', conditionOrMessage)
    else if (conditionOrMessage) console.error('[vue-haptic]', message)
}
