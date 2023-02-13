# Extension Example, Rollup

This is an example of an extension.
Extensions are where the primary functionality should be hosted.
The `es-runtime` allows extensions to register panels that
are wrapped in a shadow DOM so that each extension does not
have to worry about the CSS of other extensions interacting
with its components.

This extension uses React as the component library and `rollup` as its bundler.
