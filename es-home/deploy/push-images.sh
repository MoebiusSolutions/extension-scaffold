#/bin/bash

set -e
SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

if (( $# < 1 )); then
  echo "Usage $0 <tag>"
  exit 2
fi

push_image() {
  docker image push "docker-dfntc.di2e.net/moesol/extension-scaffold/$1:$2"
}

VERSION_TAG=$1

echo "Pushing version ${VERSION_TAG}"
push_image es-home ${VERSION_TAG}