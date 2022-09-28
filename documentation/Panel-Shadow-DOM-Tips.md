# Panel Shadow DOM Tips

## Resolving Relative Resources

If you chose to not use an `iframe` for your extension panel, 
then you must be aware that resources you load with relative URLs 
will be resolved using the `baseUrl` from the "hosting" page.

To make finding relative resources easier the `activate` function receives the `baseUrl` of the extension script.
You can turn this into a fully qualified URL by using the browsers `URL` class.
Below, we compute `href`, a fully qualified URL, from the relative resource path `/global.css`.

```typescript
activate(..., baseUrl: string) {
	const href = new URL('/global.css', baseUrl)
}
```

For example, `es-extension-examples/ext-example-svelte/src/main.js` 
shows how you can use the technique above to load style sheet links into the shadow DOM.

## Injecting Material UI Styles into the Shadow DOM

```tsx
import { jssPreset, StylesProvider } from "@material-ui/styles"; 
import { create } from "jss";
 
export async function activate (scaffold) {
 
const div = await scaffold.addPanel({
    id: `${APP_ID}`,
    title: "Case Manager UI Left",
    location: "center",
    resizeHandle: true
});
```
Tell material ui where to inject the styling rules
so we do not have to manually import into the Shadow DOM

```tsx
const jss = create({
    ...jssPreset(),
    insertionPoint: div
});

render(<StylesProvider jss={jss}>
        <App scaffold={scaffold} />
    </StylesProvider>, div);
}
```

To force a MUI Dialog to appear in-place in the html tree, set `disablePortal`

```tsx
return <Dialog open={open} onClose={cancel} disablePortal>
      …
</Dialog>
```
