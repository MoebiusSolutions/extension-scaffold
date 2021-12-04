## Change Log

# [1.10.0] - 2021-12-03

### Added

* es-ribbon-dropdown web component
* Added a LitElements ribbon example.
* Demonstrate input type="checkbox" tied to Show Code
* Demonstrate disabled ribbon button item
* Demonstrate Layers ribbon button toggling a left panel.
* Log error if extension throws during activate.

### Changed

* Made theme select look a little nicer.
* Improved built-in console to print stack for errors

### Removed

* Removed above left example for now

# [1.9.0] - 2021-12-01

### Added

* Fixed developer mode failing to generate `index.json`
* Fix bottom expanded and top-bar background.
* Fix center stack bug.
* Added feature for extensions to "claim" ribbon bar sections/panels.
* Added a `console-extension` to show console output in a drop down panel.

### Changed

* Smaller security banner font
* The `bottom-bar` location now supports resize, tabs, and expand.


# [1.8.0]  - 2021-11-17
### Added
* When environment variable URLPATH is set, relocates `es-home`
* Add expand button to bottom panel

### Changed
* Instead of defaulting to `#example` list available applications.
* Buttons on left/right show rotated title if `icon` is not provided.

# [1.7.0]  - 2021-11-06
### Removed
* Removed hardcoded height on left/right bar controller buttons.

# [1.6.0] - 2021-10-21

### Added

* Blocked extensions (including iframes)
### Changed

* Fix access to iframe.contentWindow during `add-frame` event.

# [1.5.0] - 2021-10-15

### Added

* kbar - Load Application allows an application JSON file to be paste into a textarea then applied
* kbar - Simple use of IWC sends a message to `es.ping.topic`

### Changed

* Control+k bar uses `focusout` event instead of `blur` since `focusout` bubbles
* kbar matches use pointer cursor to indicate they can be clicked
* Fixed bug introduced by modal example
* Fixed artifacts left on page after removing the last panel in a grid location
* Example `bgo.json` now adds many of the ATF pages as panels

# [1.4.0] - 2021-10-10

### Added

* Custom event `add-iframe`, which passes the `iframe` as the event argument

# [1.3.0] - 2021-10-09

### Added

* `es-home` is a data driven hosting page using the #hash 
  to select which application configuration to load
* Context API to support passing around the `bcst-bus` URL and provider configuration
* Record package and git version information in version.json
* Default resizeHandle to true for some panel locations.

* Use Control+k to access admin functions:
  * Add Extension
  * Panel List
  * Toggle Panel
  * Remove Panel
  * Show Context
### Changed
    
* Configured `#example` to no longer make a center panel from a non-existing map URL
* Refactor getDivSize to use lookup table.

# [1.2.0] - 2021-09-30

### Added

* Document what to install to run the unit tests
* Remove ext-react-snowpack from default list so we can test adding int dynamically
* Added tabs to bottom panel area
* Added es-ribbon source code
* Store grid information in localStorage

### Changed

* Use classes instead of style in more places

# [1.1.0] - 2021-06-09

### Added

* Add "elevation" styling so that light theme looks better.
* Material "elevation" shadow borders.
* Example to Toggle dark/light theme.

### Changed

* Fixed: Location `wide-portal` was eating all pointer events
* Replace hard coded colors with theme colors

### Removed

* Removed `position: absolute` when using `iframe` support.
  `@evans.good` found this was causing his ribbon an issue.

# [1.0.0] - 2021-05-27

### **Breaking API** Changes

* `loadExtension` replaced by `loadExtensions`
  (which supports restoring the grid state for `left`, `right`, `top`, `bottom`)
* All panel methods moved under `api.chrome.panels`

### Added

* Pop Out Panel
* Wide / Full Top/Bottom Bar
* Ribbon Bar example
* Amplify over center (map) example
* Icons for Left/Right Bar
* Get Grid State and `grid-changed` events

### Changed

* Documentation Updates

# [0.7.0] - 2021-05-13

Initial feature set.

### Added 

* Theme colors
* `iframeSource` to `AddPanelOptions`
* Styling improvements

### Changed

* Documentation Updates

# [0.6.0] - 2021-05-10 

### Added

* Added `loadExtension` method to API

### Changed

* Documentation Updates
* min/max size for center panel is now ensured

# [0.5.0] - 2021-05-10 

### Added

* Control the max panel sizes
* Added `boot` method
* Left and Right button bars
* Example of loading CSS via a link
* Example of "claiming" `style` elements from `head`

### Changed

* Documentation Updates

### Removed

* Removed the `ping` method

# [0.2.0] - 2021-05-04

### Changed

* Documentation Updates

# [0.1.0] - 2021-05-04

Work in progress
