## Change Log

# [2.8.0] - 2022-04-15

### Added

* Example of a dropdown with a text field in it.
* Initial MIPA config/ribbon
* Add script for building war file
* Add GCCSM Jenkinsfile
* Scripts to build es-common-extensions image.
* Unified ribbon examples `apps.json`

### Updated

* Updated `es-runtime` release documentation
* Theme select close on click is more consistent with user expectations.
* Fix URL paths to match dev26 `/es/ui/` and `/es/common/...`
* Ribbon icon padding for `DFNTC-15213`
* Upgrade to `@gots/noowf-inter-widget-communication@2.6.0`
* Updated CSS to have smaller left/right button bar

### Deleted

# [2.7.1] - 2022-03-22

* Fix `deploy` build issue.

# [2.7.0] - 2022-03-22

### Added

* Example to demonstrate how to update left tab label
* Push panel gridstate onto history stack for show/hide/expand/restore panel events 
* Example for `gccs-m.json`/Ribbon
* Automate deployment of extension scaffold for non containers
* Provide an alert dialog if we fail to load the app.json file.
* New `removeButton` option, when enabled and clicked removes the panel
* The `active` panel defines which icons appear in the panel header.
* New set of defaults for 'left', 'right', 'top', 'bottom' verus 'bottom-bar'
* Support to build monorepo with `rush`

### Changed

* proxy Dockerfile uses centos:7
* aasw.json sets initialWidthOrHeight to 13em
* Fix unhandled exception when handling history stack change
* Reference to `es-runtime` made relative to speed development
* Fix broken type signature for optional parameter, `pushToHistory`
* Improve JSDoc in `es-api.ts`
* Switch `remove` use close icon.
* Update the `hide` button to be align bottom icon.
* Rotate icons to make them align with the direction the panel will "move".
* skipLibCheck to avoid type checking `node_modules`
* Rename folder `compose` to `es-compose`
* Upgrade `nodejs` to get newer version of `git` required by `rush`

### Removed

* `aasw.json` - Removing Timeslider, added by ribbon now
* Remove unused `AboveLeft` example. See `left-of-tabs` in ribbon specification
* Removed duplicate panel header icons on `bottom` panel

# [2.6.1] - 2022-03-03

* Build `es-runtime` with upgraded dependencies.

# [2.6.0] - 2022-03-03

### Added

* Scripts and instructions for building `rpm`
* TPT's ribbon description
* Scripts and Dockerfile to build a docker container for `es-home`

### Changed

* Fixed z-index of `es-ribbon-dropdown` to make sure it is over other panels
* Made snowpack example URL "relocatable".
* BGO's ribbon description
* AASW's ribbon description

# [2.5.0] - 2022-02-03

### Added

* Host broadcast bus from `es-home`, path `/ui/bcst-bus/index.html`
* Validation of JSON for `ribbon`
* Support for building an RPM to install `es-home`
* Example of using `@gots/noowf-widget-launch`
* `es-ribbon-row` web component
* Support for React setting a components `className`
* TPT 2.0 ribbon examples
* New API method `api.chrome.panels.isPanelHidden(id: string)`
  * See `ribbon-tracks.tsx` for example code.
* Validate of `location` input parameter

### Changes

* Does not add an empty `<label>` if no `"label"` attribute was specified
* Fix `align-self` when split in row.
* All `npm login` examples show the CSA option

### Removed

* `es-demo` sample hosting page
* `es-ribbon` sample React ribbon - superseded by `es-ribbon-*` web components
* Unused dependency `@rmwc/elevation`

# [2.4.0] - 2022-01-11

### Added

* More ribbon bar documentation
* More json configuration documentation with links between README files.
* IWC configuration passed as query parameters to iframes - `iwc` and `busUrl`
* JSON configuration can define the IWC configuration
* Ribbon json now supports "location" of `left-of-tabs` or `right-of-tabs`
* `es-ribbon-dropdown-item` now supports `disabled`
* Example to show/hide a ribbon tab

### Changed

* Documentation on how to develop `es-runtime` without having to run `npm pack`
* Fix cursor flicker for ribbon buttons
* Add onclick to disabled button to verify it is not called

# [2.3.0] - 2022-01-07

### Added

* Add es-ribbon-column web component.
  Puts contained es-ribbon-button-small/split into a column layout.
* Add Track ribbon tab example.
  It has GCCS-M `webmap` ribbon buttons.
  It toggles the track summary in the `bottom-bar`.
  It opens CTM windows for the enabled buttons.
  The disabled buttons need map selection integration.
* Add a `scaffold.chrome.panels.closeLocation(location: Location)` api

### Changed

* Only set the width/height when adding the first panel. 
  Otherwise, if you add/remove/add a panel you will reset any user defined width/height
* Shorten the debug memory graph a bit to condense ribbon
* Better dropdown icon positioning
* Padding for small/split buttons with or without a nested dropdown.
* Common 10pt font for text in ribbon section
* Fix css typo that breaks `disabled`
* Ribbon buttons small/split that have a dropdown do not stretch

# [2.2.0] - 2022-01-03

### Added

* Example of moving a panel between left/right
* `relocate` option to override JSON location when moving a panel
* `About Runtime` to ribbon
* Allow a tab to be hidden at startup - use case is a context tab
  that is only visible when the right items are selected.
* Example with `popOutButton: false`
* `FEATURES.md`
* Show code for track tab icon
* `expandPanel()` API
* `<baseurl href="...">` to pop out container window
* Show source for radio button section
* Radio buttons synchronize to the show source state

### Changed

* Restored ribbon "float" feature
* Fix amplify button when moving panel left/right
* Fix modal button when moving panel left/right
* Fix track tab icon rotation direction
* Fix background color for objects w/z-index
* Fix where left panel resize bar shows up when left has scrollbar.
* Fix `snowpack` caching of `es-runtime` in `es-home`
  During development, update `es-runtime` by running `npm run build`
  from the `es-runtime` directory.
* Minor vertical align tweak in ribbon tab
* Fix relative position causing scrollbar when ribbon dropdown open
* Switch `bottom-bar` to `es-panel-header-bar` web component
* Refactor show source code to use `<FormatFileName>`
* Fix maximize center not working
* Fix left/right bar state not correct if center was maximized
  but a request to show a left/right panel was made

### Removed

* Remove old example Ribbon.tsx

# [2.1.0] - 2021-12-09

### Added

* Description of how `es-home` works.
* A hover panel header has been added. 
  The areas `left`, `right`, `top`, and `bottom` get a "pop out button" and a "hide button" by default.
  > Note: that future releases plan to make this per extension instead of shared by all panels in the area.
* If an extension tries to call `claimRibbonPanel` with a section ID that has
  already been claimed, we give a `console.warn` message.
* JSON configuration for `iframe` now supports a `hidden` option.
  By hiding the `iframe` ES can emulate OWF background widgets.
  > Note: the hidden iframe ignores the location option and attaches the `iframe`
  > under the `root` `div`. Therefore, you cannot later switch the `iframe` to visible.
* A beta implementation of pseudo ribbon section IDs named: `ribbon-left-of-tabs` and `ribbon-left-of-tabs`.
  > Note: this will be changed in the next release!
  > In the next release we plan to have pseudo tabs with `"area": "tab-left"` or `"area": "tab-right"`.
  > Those areas will be like tabs in that they will have section IDs that can be "claimed",
  > but they will not be decorated as tabs.

### Changed

* Extracted common extensions into their own folder so that they can be separately hosted
  and used across any applications that want them.
  * `console-extension.json` provides `debug.console`
  * `debug-metrics.json` provides `debug.metrics`
  * `classification-banner.json` provides `es.common.classification.banner.header`
    > Note: This is still coded to unclassified.
* Finally, the panel placement engine will use the location from the application JSON
  instead of the `addPanel options.location`.
* Also, the JSON order defines the button order in the left/right/bottom bars.
  Panels added with IDs not in the JSON definition are placed after the ordered panels, 
  in the order they are registered.
  > Note: Still need a configuration to define which panel is "active" at startup
* Local `compose` development URLs updated to match production so that the
  configurations for the URLs can be used in production.
* In webpack example use `baseUrl` to find self to load webpack script.
* In IFrame example log when loaded.
* Fixed css binding so that we can style head-bar via classes.

# [2.0.0] - 2021-12-05

### Added

* `<es-ribbon-button-small>` - so that you can stack multiple buttons vertically
* Example of using `<input type="radio">` in `<es-ribbon-dropdown>`
* Ribbon collapse and expand (like the other tabbed areas)
* `<es-ribbon-button-split>` - you can click the "quick action" to trigger it, or drop down other selections.
* `<es-ribbon-button disabled>` now works
* Fetch code snippets from the server instead of hard coding them into the Typescript code.
* Display JavaScript engine memory usage on Help tab
* `claimStyleFromHeadElementMatching` allows any `predicate` to check for claiming the stylesheet.
* `<es-ribbon-dropdown-item>` provides default styling for items in a dropdown
* `<es-ribbon-dropdown>` has two new methods: `open()` and `close()`
  You can call them from the debug console after assigning
  a temporary variable to the element.
* Click handler to lit elements example
* Three different examples of selecting the theme to show different ways of doing the dropdown menu.

### Changed

* Move adding `overflow: visible` on the `top-bar` grid area to the `ribbon.ts` code.
* Replaced `react-syntax-highlighter` with `prismjs` (much better for Snowpack).
* Cleaned up scrollbars on the source code viewer center panel
* Fixed reRenderer closing the logs windows
* Fixed scrolling issues in the debug console when new messages arrived

### Removed

* Breaking change - renamed `name` to `label` in all of the <es-ribbon-*> components. 
  For example: <es-ribbon-section name="Area Plans">
  becomes <es-ribbon-section label="Area Plans">

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
