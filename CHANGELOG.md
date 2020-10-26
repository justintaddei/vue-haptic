# CHANGELOG

### 1.2.0

**Features**
- Added `cancellationPeriod` option in response to issue #4

#### 1.1.1

**Bug fixes**
- Fixed an issue where binding multiple haptics directives to a single element would only use the pattern of the last-bound directive (#2).
- Fixed an issue where native events couldn't be used as a haptic trigger on Vue components (#2).

**Other**
- Added badges to README

### 1.1.0

*Features*
- Setting any event name as the haptic trigger using directive-modifiers is now supported. 

*Bug fixes*
- Custom events now support... custom events. (See [#2](https://github.com/justintaddei/vue-haptic/issues/2))

*Other*
- Started keeping a changelog
- Major refactor of codebase
