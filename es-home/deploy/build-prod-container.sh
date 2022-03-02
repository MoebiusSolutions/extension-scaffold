#/bin/bash

set -e
SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

#
# Until docker-compose can pass secrets, we build with this script
# We are using your $HOME/.npmrc file as a secret and mounting it during
# `yarn install` (See Dockerfile).
# You can pass extra arguments to the docker build file.
# For example `./build-container.sh --progress-plain --no-cache`
#

#
# Note: the tag below must match what is in docker-compose.yml
#
set -x
sudo DOCKER_BUILDKIT=1 docker build -t extension-scaffold/es-home \
  "$SCRIPT_DIR/../../../extension-scaffold/es-home/" -f "$SCRIPT_DIR/Dockerfile" \
  --secret id=npmrc,src=$HOME/.npmrc "$@"
set +x