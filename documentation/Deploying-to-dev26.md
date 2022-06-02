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

## Push Branch to DI2E

```
$ git switch -c upgrade-es-to-{version}
$ git gui &
$ git push di2e -u upgrade-es-to-{version}
```

## Deploy

```
$ ssh basebox.dev26.niera
$ cd wk/dfntc
$ git pull
$ git switch upgrade-es-to-{version}
```

Finally deploy using `ansible`. 
See [2022-03-23_Deploying-Extension-Scaffold-Deployment-to-dev26-via-Ansible.md](https://gitlab.moesol.com/dfntc/minerva-moesol-wiki/-/blob/master/2022-03-23_Deploying-Extension-Scaffold-Deployment-to-dev26-via-Ansible.md)

Or, just edit `cjmtk3.dev26.niera:/opt/extension-scaffold/docker-compose.yml` and set the versions to `{version}`.
