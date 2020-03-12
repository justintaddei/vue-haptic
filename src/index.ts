import { PluginObject } from 'vue/types/plugin';
import { DirectiveBinding } from 'vue/types/options';

// Silent navigator.vibrate polyfill
if (!('vibrate' in window.navigator)) (window.navigator as any).vibrate = () => {};

/**
 * A haptic vibration pattern
 */
export type HapticPattern = number | number[];
/**
 * A function defined by the user of the plugin
 * to setup a custom trigger for haptic feedback.
 */
export type HapticTriggerFunction = (activator: (pattern?: HapticPattern) => void, el: HTMLElement) => void;

/**
 * Haptic options that can be passed to
 * the directive itself (i.e not the global options)
 */
export interface ILocalHapticOptions {
  /**
   * A pattern override
   */
  pattern?: HapticPattern;
  /**
   * A function used to provide a custom
   * trigger for the haptics
   */
  trigger?: HapticTriggerFunction | string;
}

/**
 * Global Haptic Options
 */
export interface IGlobalHapticOptions {
  /**
   * Used define patterns that can be used
   * as the argument of the v-haptic directive
   */
  patterns?: {
    [name: string]: HapticPattern;
  };
  /**
   * Used to disable haptics globally
   */
  disabled?: boolean;
  /**
   * Used to change the default trigger
   * to something other than "pointerdown"
   */
  defaultHapticTrigger?: string;
}

/**
 * Computes the `pattern` and `trigger` based on provided options
 * @param binding A Vue directive binding
 * @param globalHapticOptions Global haptic options object
 */
function computeHapticOptions(
  binding: DirectiveBinding,
  globalHapticOptions?: IGlobalHapticOptions,
): {
  pattern: HapticPattern;
  trigger: HapticTriggerFunction | string;
} {
  /**
   * The haptic pattern
   */
  let pattern: HapticPattern | string | void;

  /**
   * The value of the the directive
   */
  const directiveValue: HapticPattern | ILocalHapticOptions | void = binding.value;

  /**
   * Custom trigger function (if any)
   */
  let trigger: HapticTriggerFunction | string | void;

  // Switch based on the datatype of the value
  switch (typeof directiveValue) {
    case 'number':
    case 'string':
      // If the value was a number or a string
      // we will set the `pattern` equal to this value.
      // Note that if an argument was also given, this will override that value
      pattern = directiveValue;
      break;
    case 'function':
      // If the value was a function we will
      // assume that is a custom trigger function
      trigger = directiveValue;
    // Because the value doesn't contain a pattern
    // we won't break here since we still need to hit the default case
    case 'object':
      // If the value is an array we will assume that
      // is a vibration pattern
      if (directiveValue instanceof Array) {
        pattern = directiveValue;
        break;
      }

      // At this point we know that the value
      // is an object and we know it's not an array.

      // If a trigger is defined, we will set it as the trigger
      if (directiveValue.trigger) trigger = directiveValue.trigger;
      // Again, we won't break here because
      // we either need to hit the next if statment
      // or the default case

      if (directiveValue.pattern) {
        // If a pattern is defined, we'll set the `pattern` equal to this value.
        pattern = directiveValue.pattern;
        // We can break now because we have set both the trigger and the pattern
        break;
      }
    default:
      // Set the pattern to the preset name given as the argument
      // or "default" if the argument is undefined
      pattern = binding.arg || 'default';
  }

  // If the pattern is a string we'll assume it is a global preset defined by the user
  if (typeof pattern === 'string') pattern = globalHapticOptions?.patterns?.[pattern];

  // If the pattern is undefined at the point it's because the user forget to define the preset
  // or they didn't define a default pattern
  if (typeof pattern === 'undefined') throw new Error('[v-haptic] No haptic pattern was specified');

  // If `trigger` is undefined we'll check the modifers
  if (typeof trigger === 'undefined') if (binding.modifiers.pointerup) trigger = 'pointerup';
  if (binding.modifiers.pointerdown) trigger = 'pointerdown';
  else if (binding.modifiers.change) trigger = 'change';
  else if (binding.modifiers.input) trigger = 'input';
  // If none of the modifers were set then
  // we'll use 'pointerdown' as the event name
  else trigger = globalHapticOptions?.defaultHapticTrigger || 'pointerdown';

  return {
    pattern,
    trigger,
  };
}

/**
 * A WeekMap used to store the haptic pattern of a given
 * element. We use a WeekMap here because if we used a regular Map
 * object, it would hold the element we're using as a key in memory
 */
const patternMap = new WeakMap<HTMLElement, HapticPattern>();

// Vue.js plugin
export default {
  // Called by vue
  install(Vue, globalHapticOptions = {}) {
    // Set component-level methods
    Vue.prototype.$haptics = {
      /**
       * Access to global patterns object
       */
      patterns: globalHapticOptions?.patterns || {},
      set disabled(disabled: boolean) {
        globalHapticOptions.disabled = disabled;
      },
      /**
       * Disable or enable haptics globally
       */
      get disabled(): boolean {
        return Boolean(globalHapticOptions?.disabled);
      },
      /**
       * Cancel any currently running haptics
       */
      cancel() {
        navigator.vibrate(0);
      },
    };

    // Define v-haptic directive
    Vue.directive('haptic', {
      // Called when the directive is bound to the element
      bind(el, binding) {
        // Compute the pattern and trigger based on provided options
        const { pattern, trigger } = computeHapticOptions(binding, globalHapticOptions);

        // Store the pattern in a WeakMap
        // so it can be updated in the`update` hook
        patternMap.set(el, pattern);

        // If `trigger` is a string, we will assume it is an event name
        if (typeof trigger === 'string') {
          // Add the event listener to the element with v-haptic
          el.addEventListener(trigger, function(this: HTMLElement) {
            // If haptics are disabled, we'll just ignore the event.
            if (globalHapticOptions.disabled) return;

            // Get the pattern from the WeakMap
            // We don't use the `pattern` variable from
            // the parent scope because it will not update
            // if the user of the plugin changes the
            // argument or value of the directive
            const _pattern = patternMap.get(this) as HapticPattern;

            // Make the device vibrate
            navigator.vibrate(_pattern);
          });
        }
        // If trigger was not a string then it must be a function.
        else {
          // Call `trigger` to let the user of the plugin
          // do whatever setup is needed
          trigger(_pattern => {
            // If haptics are disabled, we'll just ignore
            // their call to the activator.
            if (globalHapticOptions.disabled) return;

            // Make the device vibrate.
            // We'll the pattern provided to
            // the activator function if it's defined.
            // Otherwise, we'll the pattern declared in the markup,
            // or the default pattern if no pattern was declared.
            navigator.vibrate(_pattern || (patternMap.get(el) as HapticPattern));
          }, el);
        }
      },
      // Called when the directive's argument or value is changed
      update(el, binding) {
        // Recompute the pattern.
        // We don't need the trigger this time.
        const { pattern } = computeHapticOptions(binding, globalHapticOptions);
        // Update the pattern in the WeakMap
        patternMap.set(el, pattern);
      },
    });
  },
} as PluginObject<IGlobalHapticOptions>;
