import { PluginObject } from 'vue/types/plugin';

export type HapticPattern = number | number[];

export interface ICustomHapticPresets {
  [name: string]: HapticPattern;
}

export default {
  install(Vue) {
    Vue.directive('haptic', {
      bind(el) {
        el.addEventListener('pointerdown', () => {
          navigator.vibrate([10, 5, 10, 5, 20]);
        });
      },
    });
  },
} as PluginObject<ICustomHapticPresets>;
