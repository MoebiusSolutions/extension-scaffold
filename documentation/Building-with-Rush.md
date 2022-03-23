# Building with Rush

Normally, the `docker-compse` runtime environment is sufficient for development.
However, building with `rush` is a way to make sure all of the examples
will "compile" against the `es-runtime` library.

## Install Rush

```
$ npm install -g @microsoft/rush
```

## Install Dependencies

```
cd /home/extension-scaffold
rush update
```

## Build

```
cd /home/extension-scaffold
rush build
```
