# Features

## Ribbon

* Clicking a tab opens its ribbon

* Clicking a tab that is already open toggles the ribbon bar open/closed

* Clicking the expand / close icon will layer the ribbon over other panels 
  or expand the top-bar to contain the ribbon

* Clicking the up-arrow will close the ribbon

An extension claiming a ribbon section can use these pre-registered web components:
* `es-ribbon-section`
    * `es-ribbon-button`
    * `es-ribbon-button-split`
    * `es-ribbon-button-small`
        * You can nest `label`
        * You can next `es-ribbon-dropdown`

> Note: web components require the full closing tag.
> So, `<es-ribbon-section />` will not work.
> Instead, use `<es-ribbon-section> ... </es-ribbon-section>`

> Note: when using typescript you can make `tsx` aware of the components with:

```ts
//
// Let typescript know about our web components
//
declare namespace JSX {
  interface IntrinsicElements {
    "es-ribbon-section": any;
    "es-ribbon-button": any;
    "es-ribbon-button-small": any;
    "es-ribbon-button-split": any;
    "es-ribbon-dropdown": any;
    "es-ribbon-dropdown-item": any;
  }
}
```

## React Helper Functions

```tsx
/**
 * Helper functions to avoid if (div === null) broiler plate.
 */
function claimRibbonThen(scaffold: ExtensionScaffoldApi, id: string, f: (div: HTMLDivElement) => void) {
  const div = scaffold.chrome.ribbonBar.claimRibbonPanel(id)
  if (div === null) {
    console.error('ribbon panel not found', id)
    return
  }
  f(div)
}
function claimRibbonWith(scaffold: ExtensionScaffoldApi, id: string, node: React.ReactNode) {
  claimRibbonThen(scaffold, id, div => {
    ReactDOM.render(<React.StrictMode>{node}</React.StrictMode>,div)
  })
}
```

### View Tab

* `Show Code` button - note currently does not toggle center panel with source.
  Clicking the button shows the source code for the LitElements "section"
  of the ribbon.
  Also, shows how to use `<br>` to split button label onto two lines.

* `Split 1/Split 2` dropdown shows that when focus changes the dropdown closes.
  Shows how to use two `<label>` elements to split labels onto two lines
  The dropdown has three plain buttons One, Two, Three.
  When clicked they alert.

* `Disabled` shows how to create a disabled button

* `Disabled Class` shows how to create a button without an icon.
  It also uses the CSS class `disabled` instead of the attribute `disabled`
  to show that either method works.

* `Dark/Light` mode shows several ways to select the theme.
  The theme is controlled by CSS variables.
  Note that no matter which control is used to switch the theme
  the other controls state should update to track.

* `Split Button` shows a button with a default action when clicked.
  If the dropdown arrow is clicked other actions show in the dropdown.
  Click the dropdown arrow, then click `Source Code` to see React code.

### Chart Settings

* `Show Code` toggle code for Chart Settings

* `Layers` toggle left panel from snowpack

* `Option One, Two, Three` show radial buttons

## Track tab

* The entire tab is blank for now.
  However, the example shows how to put an animated icon into the tab label.
  GCCS-M webmap did this in order to show the connection state.

### Tactical
* blank

### TDA
* blank

### Text2Tactical
* blank

### Mission Planning

* `New Plan` shows source code

* `Pucks` shows drop down with button and div

### Help

* `Console` shows the embedded console we can use on NMCI

* `Crash` is a small button that injects a crash to show console in action

* `Bad Fetch` is a small button that injects a console log 
  after fetching a resource that does not exist.

* `Clear` - clears the embedded console log

* Memory section shows JS memory usage.

* `About Runtime` section shows version information

## Panel Management

* clicking same tab toggles open/close

* drag a closed panel to open

* drag an open panel to close

* header expand / close left, right panels

* header popOut right panel

* clicking tab for popped out panel restores it

* resize bottom-bar, resize close/open

* switch bottom-bar tabs active, close bottom, open bottom

# Road Map

* left/right of tabs as a "pseudo" tab with sections

* example using ribbon "search"

* ribbon tab scrolling when too wide

* Responsive Ribbon sections

* Move from `right` to `left` without "disconnecting" from the DOM

* Snackbar
