/*  tslint:disable:no-empty */
// Silent navigator.vibrate polyfill
if (!('vibrate' in window.navigator)) (window.navigator as any).vibrate = () => {}
