# Deploying to `dev26`

## Tag a Release

* Update and commit `CHANGELOG.md` to the `develop` branch.
* Then:

```
$ git switch release
$ git pull
$ git status
$ git merge develop
$ (cd es-home; npm version minor)
$ (cd es-runtime; npm version minor)
$ git add .
$ git commit -m'Release {version-matching-es-home/package.json/version}'
$ git tag v{version-matching-es-home/package.json/version}
$ git switch develop
$ git merge release
$ (cd es-home; npm version preminor --preid SNAPSHOT)
$ (cd es-runtime; npm version preminor --preid SNAPSHOT)
$ git add .
$ git commit -m'Next dev cycle {version}'
$ git push origin develop release --tags
```

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
$ ./es-home/deploy/tag-image.sh {version}
$ ./es-common-extensions/deploy/tag-image.sh {version}
```

## Push Containers

```
$ ./es-home/deploy/push-images.sh {version}
$ ./es-common-extensions/deploy/push-images.sh {version}
```

## Update Image Tags in `minerva-infrastructure`

In file `minerva-infrastructure/ansible/roles/extension-scaffold/defaults/main.yml`

* `extension_scaffold__home_version: {version}`
* `es_common__version: {version}`

## Push Branch to TRMC

```
$ git switch -c upgrade-es-to-{version}
$ git gui &
$ git push origin -u upgrade-es-to-{version}
```

* Submit pull-request to merge into `master`

## Deploy

### Using Ansible

```
$ ssh basebox.dev26.niera
$ cd wk/trmc
$ git pull
$ git switch upgrade-es-to-{version}
```

Finally deploy using `ansible`. 
See [2022-03-23_Deploying-Extension-Scaffold-Deployment-to-dev26-via-Ansible.md](https://gitlab.moesol.com/dfntc/minerva-moesol-wiki/-/blob/master/2022-03-23_Deploying-Extension-Scaffold-Deployment-to-dev26-via-Ansible.md)

### Using `vi`

Or, just edit `cjmtk3.dev26.niera:/opt/extension-scaffold/docker-compose.yml` and set the versions to `{version}`.
Then,

```
$ sudo cd /opt/extension-scaffold
$ docker-compose down
$ docker-compose up -d
```
