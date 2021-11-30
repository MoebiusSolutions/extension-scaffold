# Extensible Ribbon

The extensible ribbon adds new JSON data in the application configuration file,
and new APIs that allow extensions to "claim" panels in the ribbon.
Applications define the order of the tabs using JSON data described below.
Furthermore, applications define which sections go into which tabs, which different
applications to group functionality under different tabs if required.

## JSON definition for the application ribbon

The `ribbon` property is an array tab definitions.
The label on the tab is defined by the `tab` property.
The seconds on the tab is defined by the `sections` property. 
The `sections` property is an array of unique IDs.

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
        }
    ],
```

## Ribbon API

The new API `scaffold.chrome.ribbonBar.claimRibbonPanel(id: string)` allows an extension to "claim" the panel 
and place its content within the section.

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
