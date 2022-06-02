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
NPM_CONFIG_USERCONFIG=${NPM_CONFIG_USERCONFIG:=${HOME}/.npmrc}

if [[ -z "$NOSUDO" ]]; then
    SUDO="sudo DOCKER_BUILDKIT=1"
else
    SUDO=''
fi

#
# Note: the tag below must match what is in docker-compose.yml
#
set -x
export DOCKER_BUILDKIT=1
${SUDO} docker build -t extension-scaffold/es-home \
  "$SCRIPT_DIR/.." -f "$SCRIPT_DIR/Dockerfile" \
  --label "minerva.git.describe=`git describe --long --tag`" \
  --secret id=npmrc,src=${NPM_CONFIG_USERCONFIG} "$@"
set +x
