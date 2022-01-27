# Extensible Ribbon

The extensible ribbon adds new JSON data in the application configuration file,
and new APIs that allow extensions to "claim" panels in the ribbon.
Applications define the order of the tabs using JSON data described below.
Furthermore, applications define which sections go into which tabs, which different
applications to group functionality under different tabs if required.

## JSON definition for the application ribbon

The `ribbon` property is an array of ribbon item definitions.
For a ribbon tab, the label on the tab is defined by the `tab` property.
The sections on the tab are defined by the `sections` property. 
The `sections` property is an array of unique IDs.

Two non-tab locations exist to support the HSI guidelines.
To define these locations, declare the property `location`
with the value of `left-of-tabs` or `right-of-tabs`.
As with tabs, the sections in the area are defined by the `sections` property. 

```json
    "ribbon": [
        {
            "tab": "File",
            "sections": [
                "file.section1",
                "file.section2"
            ]
        },
        {
            "tab": "Display",
            "sections": [
                "display.theme",
                "display.map",
                "display.tracks",
                "display.controls"
            ]
        },
        { 
            "tab": "Mission Planning", 
            "sections": [
                "mp.area.plans",
                "mp.general.area",
                "mp.assets",
                "mp.asw.search.planning",
                "mp.review",
                "mp.messages"
            ]
        },
        {
            "tab": "Help",
            "sections": [
                "help.about",
                "help.version"
            ]
        },
        {
            "location": "left-of-tabs",
            "sections": [
                "example.scenario.selector"
            ]
        },
        {
            "location": "right-of-tabs",
            "sections": [
                "ctm.users",
                "shared.search"
            ]
        }
    ],
```

## Ribbon API

### API: `scaffold.chrome.ribbonBar.claimRibbonPanel(id: string)`

The API `scaffold.chrome.ribbonBar.claimRibbonPanel(id: string)` 
allows an extension to "claim" the panel and place its content within the section.

```ts
/**
 * Claim the ribbon panels that belong to this extension
 */
function claimRibbonThen(scaffold: ExtensionScaffoldApi, id: string, f: (div: HTMLDivElement) => void) {
  const div = scaffold.chrome.ribbonBar.claimRibbonPanel(id)
  if (div === null) {
    console.error('ribbon panel not found', id)
    return
  }
  f(div)
}
export function doClaimRibbon(scaffold: ExtensionScaffoldApi) {
  claimRibbonThen(scaffold, 'display.theme', div => {
    ReactDOM.render(
      <React.StrictMode>
        <ThemeSelect container={ scaffold.gridContainer } />
      </React.StrictMode>,
      div
    )
  })

  // ...
  // claim more ribbon panels for this extension

```

### API: `scaffold.chrome.ribbonBar.claimRibbonTab(tab: string)` 

The API `scaffold.chrome.ribbonBar.claimRibbonTab(tab: string)` 
allows an extension to claim a tab `<div>`.
The example below adds a rotating icon to the *Tracks* tab:

```tsx
function claimTrackTab(scaffold: ExtensionScaffoldApi) {
  const tab = scaffold.chrome.ribbonBar.claimRibbonTab('Track')
  if (!tab) { return }

  ReactDOM.render(<React.StrictMode>
    <style>{/*css*/`
      .wrapper {
        display: flex;
        align-items: flex-end;
      }
      @media (prefers-reduced-motion: no-preference) {
        .loop-icon {
          fill: green;
          height: 1em;
          padding-top: 2px;
          animation: Loop-icon-spin infinite 20s linear reverse;
        }
      }
      @keyframes Loop-icon-spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `}</style>
    <div className="wrapper">
      <LoopIcon/>
      <label>Track</label>
    </div>
    </React.StrictMode>, tab)
}
```

### API: `scaffold.chrome.ribbonBar.showRibbonTab(tab: string)` 

Shows a hidden ribbon tab.
An extension can show a ribbon tab in response to an object being selected.

### API: `scaffold.chrome.ribbonBar.hideRibbonTab(tab: string)` 

Hides a ribbon tab.
An extension can show a ribbon tab in response to an object being deselected.

## Ribbon Web Components

Use of the ribbon web components by an extension is not mandatory.
However, using them will give the ribbon components a common look and feel.
These custom web components are pre-registered by the framework.
A JavaScript framework can use these web components in a manner similar to using built-in html elements.
Typescript programs may need to declare the components to avoid typescript errors.

```ts
//
// Let typescript know about our web components
//
declare namespace JSX {
  interface IntrinsicElements {
    "es-ribbon-section": any;
    "es-ribbon-row": any;
    "es-ribbon-column": any;
    "es-ribbon-button": any;
    "es-ribbon-button-small": any;
    "es-ribbon-button-split": any;
    "es-ribbon-dropdown": any;
    "es-ribbon-dropdown-item": any;
  }
}
```

### Component `es-ribbon-section`

Sets up a container to fill the available panel space.
Adds its label to the bottom of the section to identify the section.
Example:
```tsx
const TracksManage = () => {
  return <es-ribbon-section label="Manage Tracks">
    <es-ribbon-button disabled>
        <SelectIcon />
        <label>Select</label>
        <label>Tracks</label>
    </es-ribbon-button>
    <es-ribbon-button onClick={newTrack}>
        <AddIcon />
        <label>New</label>
        <label>Track</label>
    </es-ribbon-button>
    <es-ribbon-column>
        <es-ribbon-button-small label="Edit" disabled ><EditIcon /></es-ribbon-button-small>
        <es-ribbon-button-small label="Compare" disabled ><MergeIcon /></es-ribbon-button-small>
        <es-ribbon-button-small label="Un-merge" disabled ><UndoIcon /></es-ribbon-button-small>
    </es-ribbon-column>
    <es-ribbon-column>
        <es-ribbon-button-small label="Quick Report" disabled ><AddLocationIcon /></es-ribbon-button-small>
        <es-ribbon-button-small label="Find Duplicates" onClick={findDuplications} ><SearchIcon /></es-ribbon-button-small>
        <es-ribbon-button-small label="Transmit" disabled ><SendIcon /></es-ribbon-button-small>
    </es-ribbon-column>
    <es-ribbon-column>
        <es-ribbon-button-small label="Delete" disabled ><DeleteIcon /></es-ribbon-button-small>
    </es-ribbon-column>
  </es-ribbon-section>
}
```

#### Attributes

* `label`

### Component `es-ribbon-column`

Lays its children out into a vertical column. Example:
```tsx
  const Example = () => ( <es-ribbon-column>
      <es-ribbon-button-small label="Edit" disabled ><EditIcon /></es-ribbon-button-small>
      <es-ribbon-button-small label="Compare" disabled ><MergeIcon /></es-ribbon-button-small>
      <es-ribbon-button-small label="Un-merge" disabled ><UndoIcon /></es-ribbon-button-small>
  </es-ribbon-column> )

```

### Component `es-ribbon-button`

Groups an icon and labels together into a button. Example:

```tsx
  const Example = () => ( <es-ribbon-button onClick={newTrack}>
      <AddIcon />
      <label>New</label>
      <label>Track</label>
  </es-ribbon-button> )
```
#### Attributes

* `label`
* `disabled` 

### Component `es-ribbon-button-small`

A ribbon button on a single line of text.
Slightly smaller icon.

#### Attributes

* `label`
* `disabled` 

### Component `es-ribbon-button-split`

A split button/dropdown menu.
Clicking the button portion triggers a click.
Clicking the dropdown arrow opens the dropdown.

#### Attributes

* `label`
* `disabled` 

### Component `es-ribbon-dropdown`

Add as a child to `es-ribbon-button`, `es-ribbon-button-small`, `es-ribbon-button-split` to add a dropdown arrow. 
When the dropdown arrow is clicked a panel is displayed containing the children.
When the dropdown button loses focus the dropdown is closed.

### Component `es-ribbon-dropdown-item`

Clickable dropdown menu items.

#### Attributes

* `label`
* `disabled`
