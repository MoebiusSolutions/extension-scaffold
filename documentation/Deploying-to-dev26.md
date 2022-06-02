# Deploying to `dev26`

## Checkout Release

```
$ git switch release
$ git pull
$ git status
```

## Build with `rush`

```
$ rush install
$ rush build
```

## Build Containers

```
$ ./es-home/deploy/build-prod-container.sh
$ ./es-common-extensions/deploy/build-prod-container.sh
```

## Tag Containers

```
$ ./es-home/deploy/tag-images.sh {version}
$ ./es-common-extensions/deploy/tag-images.sh {version}
```

## Push Containers

```
$ ./es-home/deploy/push-images.sh {version}
$ ./es-common-extensions/deploy/push-images.sh {version}
```

## Update Image Tags in `dfntc-ansible`

In file `dfntc-ansible/roles/dfntc/extension-scaffold/defaults/main.yml`

* `extension_scaffold__home_version: {version}`
* `es_common__version: {version}`
