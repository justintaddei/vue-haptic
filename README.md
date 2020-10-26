# vue-haptic <!-- omit in toc -->

![](https://img.shields.io/github/issues-raw/justintaddei/vue-haptic.svg?style=flat)
![](https://img.shields.io/npm/v/vue-haptic.svg?style=flat)
![](https://img.shields.io/npm/dt/vue-haptic.svg?style=flat)
![](https://img.shields.io/npm/l/vue-haptic.svg?style=flat)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
![](https://img.shields.io/badge/language-typescript-blue.svg?style=flat)

Flexible, declarative, haptics for Vue.js using `navigator.vibrate`

**Contents**
- [Install](#install)
- [Usage](#usage)
- [Pattern Presets](#pattern-presets)
- [Other Global Options](#other-global-options)
  - [defaultHapticTrigger](#defaulthaptictrigger)
  - [disabled](#disabled)
- [Event Modifiers/Custom Triggers](#event-modifierscustom-triggers)
  - [Event modifiers](#event-modifiers)
  - [Custom trigger functions](#custom-trigger-functions)
- [vm.\$haptics.cancel()](#vmhapticscancel)

## Install

---

```bash
$ npm install vue-haptic
```

```js
// main.js
import Vue from 'vue'
import VueHaptic from 'vue-haptic';

Vue.use(VueHaptic, {
  // Required. vue-haptic does not provide
  // any out-of-the-box patterns
  patterns: {
    success: [10, 100, 30],
    failure: [10, 50, 10, 50, 50, 100, 10],
    long: 200,
    default: 10,
  },
});

// ...
```

A `pointer-events` polyfill is recommended to be used alongside `vue-haptic` to support older browsers.  
PEP is good choice: https://github.com/jquery/PEP  

Have a look at the [caniuse.com data](https://caniuse.com/pointer) for more info.

## Usage

---

```html
<!-- Uses the global "default" pattern (defined by you, see below) -->
<button v-haptic>Vibrate!</button>

<!-- Use with a different trigger event -->
<button v-haptic.pointerup>Vibrate!</button>

<!-- Use a global pattern preset (see below) -->
<button v-haptic:preset>Vibrate!</button>
<button v-haptic="preset">Vibrate!</button>

<!-- Set a one-off pattern on the element -->
<button v-haptic="200">Vibrate!</button>
<button v-haptic="[10,50,10,50,10]">Vibrate!</button>

<!-- Use a custom "trigger function"
to control when the haptic feedback occurs -->
<button v-haptic="customTrigger">Vibrate!</button>

<!-- Pass options using an object -->
<button
  v-haptic="{
    pattern: [20,100,20],
    trigger: customTriggerFunction | event-name
  }"
>
  Vibrate!
</button>
```

## Pattern Presets

---

Pattern presets are defined globally. You can name them anything that can be used as an argument for a Vue directive.

> The "default" preset is special. It is used if you don't specify a preset for `v-haptic`.

```js
// main.js
Vue.use(VueHaptic, {
  patterns: {
    foo: 200,
    bar: [10, 100, 30],
    // Special
    default: 10,
  },
});
```

Presets are also available in components as `vm.$haptics.patterns`

```js
export default {
    //...
    mounted() {
        console.log(this.$haptics.patterns.bar)
        // > [10, 100, 30]
    }
}
```

## Other Global Options

---

### defaultHapticTrigger
Use this to configure the default event used to trigger haptic feedback. By default, `"pointerdown"` is used.

```js
// main.js
Vue.use(VueHaptic, {
  // patterns: {...},

  defaultHapticTrigger: 'touchstart',
});
```

---

### disabled
Used to globally disable haptic feedback.  
This can also be changed from any component by setting `vm.$haptics.disabled`.  
The default is `false` (haptics are enabled).

```js
// main.js
Vue.use(VueHaptic, {
  // patterns: {...},

  disabled: false,
});
```

## Event Modifiers/Custom Triggers

---

### Event modifiers

You can use a directive modifier to change the trigger event for a givin element/component:

```html
<input type="checkbox" v-haptic.change>
<input type="text" v-haptic.input>
<button v-haptic.pointerup>Vibrate!</button>
<!-- etc. -->
```

This also supports custom events emitted from Vue Components:
```html
<CustomComponent v-haptic.success />
```

You can use event modifiers and presets at the same time:
```html
<button v-haptic:foo.click>Vibrate!</button>
```

The trigger event can also be set using the trigger option:
```html
<button v-haptic="{
  trigger: 'click'
}">
```
---

### Custom trigger functions

Custom trigger functions can be used when you need to trigger haptics based on something other than an event. Think of these at lifecycle hooks, in that they are called when the directive is bound an element and allow you to do setup work.

A trigger function as the following signature:

`tiggerFunction: (activator: (pattern?) => boolean, el: Element) => void`


- `activator` - a function that, when called, will activate the haptic feedback. It takes a `pattern` as an optional argument. The `pattern` can be a `number`, `number[]`, or the name of a preset. If the `pattern` is omitted, the preset defined in the markup is used instead (or the default pattern if one is not defined in the markup)
- `el` - the `Element` that the directive is bound to.

```html
<input v-haptic="customTrigger" v-model="value" />
<!-- or -->
<input v-haptic="{trigger:customTrigger}" v-model="value" />

<script>
  export default {
    data() {
      return { value: '' };
    },
    methods: {
      customTrigger(activate, el) {
        this.$watch('value', value => {
          // When the input's value is "vibrate" the haptics will be triggered.
          if (value === 'vibrate') activate(this.$haptics.patterns.bar);
        });
      },
    },
  };
</script>
```

## Miscellaneous

### cancellationPeriod  
Defines the period of time (in milliseconds) after the haptic trigger is fired but before the haptic feedback is actually activated. During this period the haptic feedback will be canceled if the user moves their finger or otherwise causes a `"pointercancel"` or `"touchcancel"` event to fire. This option is only applicable if the haptic trigger is `"pointerdown"` or `"touchstart"`.  

**Default:** 75

```html
<!-- It can be used per-directive -->
<button v-haptic="{
  cancellationPeriod: 100
}">Vibrate!</button>
```
```js
// or globally
Vue.use(VueHaptic, {
  // patterns: {...},

  cancellationPeriod: 100
});
```

## vm.\$haptics.cancel()

---

From any component, the `vm.$haptics.cancel()` method can be called to stop any currently running haptics


# Contributing

If you've found a bug, or have an idea for a feature, please create in issue!


# License

This project is distributed under the [MIT License](https://github.com/justintaddei/vue-haptics/blob/master/LICENSE.md).

The MIT License (MIT)
Copyright (c) 2020 Justin Taddei

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
