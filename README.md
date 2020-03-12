# vue-haptics

Flexible declarative haptics for Vue.js using navigator.vibrate

## Install

---

```bash
$ npm install vue-haptic
```

```js
// ...
import VueHaptic from 'vue-haptic';

VUe.use(VueHaptic, {
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

A pointer-events polyfill is recomended to be used alongside `vue-haptic` to support older browsers.  
PEP is good choice: https://github.com/jquery/PEP

## Usage

---

```html
<!-- Uses the global "default" pattern (defined by you, see below) -->
<button v-haptic>Vibrate!</button>

<!-- Use with a different trigger event -->
<button v-haptic.pointerup>Vibrate!</button>

<!-- Use a global preset pattern (see below) -->
<button v-haptic:preset>Vibrate!</button>

<!-- Set one-off pattern on the element -->
<button v-haptic="200">Vibrate!</button>
<button v-haptic="[10,50,10,50,10]">Vibrate!</button>

<!-- Use a custom "trigger" function
to control when the haptic feedback occurs -->
<button v-haptic="customTrigger">Vibrate!</button>
<button v-haptic:preset="customTrigger">Vibrate!</button>

<!-- Use a one-off pattern with a custom trigger -->
<button
  v-haptic="{
    pattern: [20,100,20],
    trigger: customTriggerFuction | event-name
  }"
>
  Vibrate!
</button>
```

## Pattern presets

---

Pattern presets are defined globally. You can name them anything that can be used as argument for a vue-directive.

> The "default" preset is special. It is used when `v-haptic` is called with neither a preset nor options

```js
Vue.use(VueHaptic, {
  patterns: {
    foo: 200,
    bar: [10, 100, 30],
    default: 10,
  },
});
```

Your patterns are also available in components as `vm.$haptics.patterns`

```js
// ...
    created() {
        console.log(this.$haptics.patterns.bar)
        // > [10, 100, 30]
    }
// ...
```

## Other global options

---

**defaultHapticTrigger**  
Used to configure the default event used to trigger haptic feedback. By default, `"pointerdown"` is used.

```js
Vue.use(VueHaptic, {
  // patterns: {...

  defaultHapticTrigger: 'touchstart',
});
```

---

**disabled**  
Used to globally disable haptic feedback.  
This can also be changed from the any component by setting `vm.$haptics.disabled`

## Modifiers

---

The following modifiers change the trigger to their respective events.  
**`v-haptic.click`**  
**`v-haptic.pointerup`**  
**`v-haptic.pointerdown`**  
**`v-haptic.change`**  
**`v-haptic.input`**

## Custom triggers

---

### Custom events

To change the trigger event to one not supported be the modifiers about, set it using the options object on the element.

```html
<button
  v-haptic="{
     trigger: 'touchmove'
 }"
>
  Vibrate!
</button>
```

### Custom trigger function

Sometimes you need to trigger haptics based on something other than an event. For that you should use a custom trigger function.

The trigger is function is passed the following arguments

- `activator` - a function that, when called, with activate the haptic feedback. It takes a `pattern` as an option argument. If a pattern is not passed, it will use the pattern declared in the markup, or the default pattern.
- `el` - the `HTMLElement` that the directive is bound to.

```html
<input v-haptic="customTrigger" v-model="value" />
<!-- or -->
<input v-haptic="{trigger:customTrigger}" />

<script>
  export default {
    data() {
      return { value: '' };
    },
    methods: {
      customTrigger(activate, el) {
        this.$watch('value', value => {
          if (value === 'vibrate') activate([100, 200, 100]);
        });
      },
    },
  };
</script>
```

## vm.\$haptics.cancel()

---

From any component, the `vm.$haptics.cancel()` method can be called to stop any currently running haptics
