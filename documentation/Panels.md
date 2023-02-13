# Panels

## Multiple Panels in the same Location

The `left-bar` and `right-bar` are currently reserved for the `es-runtime`.
The `left-bar` panel contains buttons that control which `left` panel is currently shown.
Similarly the `right-bar` panel controls which `right` panel is shown.
When more than one panel is added to the `left` or `right` location, the one added first
is shown (TODO - API to control order of buttons and which panel is shown by default).
The other panels are hidden (using style `display: none`) until the `showPanel` API is called
with the ID matching the hidden panel.

The `center`, `top`, and `bottom` panels will stack.
The last panel added or the last panel shown with `showPanel` will be displayed.
All other panels will be hidden (using style `display: none`).
If `removePanel` is called on the currently shown panel, the next panel in the "stack"
will be shown automatically. 

## Floating Panels Over the Center

Two new locations where added to the API: `modal` and `modeless`.
When `addPanel` is called with one of these locations
a "dialog" window is centered on the screen to host the panel.
The header of the dialog can be used to raise or move the dialog.
The bottom resize icon (`resizeEnabled: true`) can be dragged to resize the dialog.
* See [ext-react-snowpack.tsx](es-extension-examples/ext-example-snowpack/src/ext-react-snowpack.tsx#L109).

The example in `es-extension-examples/ext-example-snowpack/src/Ribbon.tsx` shows how to create a floating ribbon bar. 
When adding to the `portal` location, the child element can use 

```
    position: absolute;
```

* `top: 0px` is located to the bottom of the top grid area.
* `bottom: 0px` is located to the top of the bottom grid area.
* `left: 0px` is located to the right of the left panel area (which moves to the left-bar when left panel is hidden)
* `right: 0px` is located to the left of the right panel area (which moves to the right-bar when right panel is hidden)

Using the `portal` panel location you can pop panels over the `center` grid area 
and place them along any of its borders.
> Note: Since these `portal` panels will cover part of the `center` panel
> you should provide the user a way to close them.

> Note: Use the `es-ribbon` API if you want a fully functioning ribbon bar.
> * See [Extensible Ribbon](Extensible-Ribbon.md)
