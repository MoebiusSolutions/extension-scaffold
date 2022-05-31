# Extension Scaffold Compose

This is a development environment that will run the demo
and all of its dependent examples.

After installing `docker-compose` on your system and cloning this project
there are a couple of one time steps to setup before you can run the demonstration.

> In the instructions below, `extension-scaffold` is the top-level folder after cloning the project.

## Running `npm install` in all containers (now `rush update`)

We replaced `npm install` with `rush update`.
See [Building with Rush](../documentation/Building-with-Rush.md)

You will need to export `NPM_AUTH_TOKEN` so that `rush update` can access private NPM repositories.

Before first `docker-compose up -d` run `rush update` to get all the npm dependencies installed:

```
export NPM_AUTH_TOKEN=blah-blah-my-token-from-npmrc
$ rush update
```

## One-time Setup of `npm login` to Get `NPM_AUTH_TOKEN`

You will need to log `npm` into the Nexus repository.
To have `rush update` log into Nexus:

```
    $ cd extension-scaffold/es-compose
    $ docker-compose run es-home bash
    $ npm login --registry https://nexus.moesol.com/repository/gccsje-npm-hosted/ --scope @gots
```
> Use your Moebius username and password.

To use DI2E's Nexus:
```
    $ npm login --registry https://nexus.di2e.net/nexus3/repository/Private_DFNTC_NPM/ --scope @gots
```

To use CSA's Artifactory:
```
    $ npm login --registry https://services.csa.spawar.navy.mil/artifactory/api/npm/mtc2-c2f-npm-group/ --scope @gots
```

Now you can get your token from `~/.npmrc`.
Your token for a URL is everything after `:_authToken=`.

## Accessing the Development Containers

```bash
$ docker-compose up -d
```

Finally, browse to `http://localhost/es/ui/`. 
Currently, the compose environment uses many ports: `80`, `8080`, `9091`, `9092`, `9093`, and `9094`. 
It also reserves `8081`, `8082`, and `3000` for the `nodejs` development container, which is not used.

### (Optional) Running Enterprise Client

You might want to run `enterprise-client` to compare how it does something.
Clone a copy of `enterprise-client` into the directory next to `extension-scaffold`.

```
    $ cd ..
    $ ls 
    extension-scaffold
    $ git clone git@gitlab.moesol.com:je/gwa/enterprise-client.git
    $ ls
    enterprise-client
    extension-scaffold
    $ cd enterprise-client
    $ npm install # enterprise-client is not using rush
```

The next time you run `docker-compose up` it will include `enterprise-client`

Browse to http://localhost:32125 to access it.
