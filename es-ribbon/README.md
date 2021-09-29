# bgo-ui

Blue Green Optimizer user interface "hosting" page and docker compose.


# Prerequisites

- [ctm-scripts](https://gitlab.moesol.com/ctm/ctm-scripts) - Cloned, installed and running.
- [Docker-compose](https://docs.docker.com/compose/)
- [nodejs 12 or higher](https://github.com/nvm-sh/nvm) - Ubuntu and WSL2.0 use nvm.

## Setup

- Clone this repository.

- Run the following commands in terminal within this directory:
    ```
    npm i
    npx lerna bootstrap
    ```

- Get ctm network name and update .env CTM_NETWORK_NAME (default=ctma_default)
    ```
    docker network ls
    ```

- Run the following commands in terminal within this directory:
    ```
    docker-compose build
    docker-compose up
    ```

