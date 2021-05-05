# Extension Scaffold Compose

This is a development environment that will run the demo
and all of its dependent examples.

After installing `docker-compose` on your system and cloning this project
there are a couple of one time steps to setup before you can run the demonstration.

> In the instructions below, `extension-scaffold` is the top-level folder after cloning the project.

## One-time setup of `npm login`

You will need to log `npm` into the Nexus repository **inside** the container,
or the container will not start, because it will get access errors during `npm install`.
To have `npm` log into Nexus:

```
    $ cd extension-scaffold/compose
    $ docker-compose run es-demo bash
    $ npm login --registry https://nexus.moesol.com/repository/gccsje-npm-hosted/ --scope @gots
```
> Use your Moebius username and password.
> Once the modules are pushed to DI2E you will use:
> `npm login --registry https://nexus.di2e.net/nexus3/repository/Private_DFNTC_NPM/ --scope @gots`

>  While still running bash in the container, verify `npm install` is going to work:

```
    $ npm install
    $ exit
```

Now, you can run the demonstration with these commands:

```
    $ cd extension-scaffold/compose
    $ docker-compose up -d
```

Finally, browse to `http://localhost:8080/`. 
Currently, the compose environment uses many ports: `80`, `8080`, `9091`, `9092`, `9093`, and `9094`. 
It also reserves `8081`, `8082`, and `3000` for the `nodejs` development container, which is not used.

> Note: the `proxy` is still under construction.

## Running `npm install` in all containers

To speed startup, the docker-compose configuration normally
skips `npm install` if the `node_modules` folder already exists.
However, if you find you need to run `npm install` for all the
containers, you can use the command below to start the containers
and have `npm install` run before the `build` or `serve` steps.

```
    $ cd extension-scaffold/compose
    $ docker-compose --env-file .env.install up
```

### Running Enterprise Client

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
```

The next time you run `docker-compose up` it will include `enterprise-client`

Browse to http://localhost:32125 to access it.
