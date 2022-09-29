# Theming Notes

Theming (dark/light) is still a work in progress.
However, you can see the example switching themes back and forth.
Click on the Theme to toggle the theme between dark (the default) and light.

Currently these css variables are used to default the theme:

```css
:root {
    /**
     * A dark theme based on material design guidelines
     */
    --es-theme-surface: #121212;
    --es-theme-text-primary-on-background: rgba(255,255,255,0.87);
    --es-theme-text-secondary-on-background: rgba(255,255,255, 0.54);
}
```

And these are the stylings for `light`:

```css
.light {
    /**
     * A light theme based on material design guidelines
     */
     --es-theme-surface: #fff;
     --es-theme-text-primary-on-background: rgba(0, 0, 0, 0.87);
     --es-theme-text-secondary-on-background: rgba(0, 0, 0, 0.54);
```

## Material Design "Elevation" Notes

The sense of element elevation is created by the use of `box-shadow`.
The higher the element in the z-order, the larger shadow it will cast.
Material design provides some CSS styles we leverage (via copy/paste for now).

We use the `box-shadow` configuration for `1dp` from `@material` css on the `.shadow-div`.
But, that is not enough, we also have to add a margin or the shadow cannot be seen.
Interestingly that allows us to control which sides get the shadow.
We only add margin where we want the shadow/elevation to show.
We copied the `.mdc-elevation--z1` style definition over to `.shadow-div`.

```css
.mdc-elevation--z1 {
    box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
}
```

We use the `box-shadow` definition to style `shadow-div`s.

```css
.shadow-div {
    position: relative;
    flex: 1 1 auto;
    box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 
                0px 1px 1px 0px rgba(0, 0, 0, 0.14), 
                0px 1px 3px 0px rgba(0, 0, 0, 0.12);
}
```

Then we use the margin to expose it:

```css
.left .shadow-div {
  margin-right: 2px;
  margin-top: 2px;
}
```
