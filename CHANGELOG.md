# Change Log

## [1.4.6] - 2017-09-27
### Fixed
 - Changelog for `1.4.5`

### Added
- `test` dir to `.npmignore`

## [1.4.5] - 2017-09-27
### Added
- node 8 to `travis.yml`

### Changed
- Versions of `eslint`, `mocha-eslint` and `debug` to latest

## [1.4.4] - 2017-02-05
### Fixed
- Use `new Array()` and direct assignment instead of `array.push()` as it is faster
- Use `for` instead of `reduce` as it is faster
- Module order in `index.js`
- License in `package.json`

### Changed
- Author and description in `package.json`

## [1.4.3] - 2017-02-04
### Added
- Version 1.4.2 and 1.4.3 to CHANGELOG
- Background and Contributing sections to README

## [1.4.2] - 2017-02-04
### Fixed
- Consts in loops bug with node < 6 by setting strict mode

## [1.4.1] - 2017-02-04
### Added
- Version 1.4.0 and 1.4.1 to CHANGELOG

### Changed
- Versions < 1.4.0 in CHANGELOG

## [1.4.0] - 2017-02-04
### Added
- Support for nesting operators `+`, `>` and `~` in selectors

## [1.3.0] - 2017-02-03
### Added
- Support for `.class.class` selectors

## [1.2.0] - 2017-02-03
### Fixed
- Selector regex matching `.class.class`
- Previous release version should have been been a minor bump

## [1.1.2] - 2017-02-03
### Added
- Support for `*` element selector

## [1.1.1] - 2017-02-03
### Removed
- Unnecessary `if` statement

## [1.1.0] - 2017-02-03
### Added
- Support for `element`, `element.class` and `id.class` selectors
- Support for `data-class` attribute in html elements

## [1.0.3] - 2017-02-03
### Added
- Performance test results in README

## [1.0.2] - 2017-02-02
### Added
- Tests for `element` selectors and `/**/` comments
- Selectors section in README

## [1.0.1] - 2017-02-02
### Added
- Coverage

## [1.0.0] - 2017-02-02
### Added
- Support for `#id` selectors
- Support for `.class` selectors
- Compression of output