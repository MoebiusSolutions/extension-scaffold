#/bin/bash

set -e
SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

if (( $# < 1 )); then
  echo "Usage $0 <tag>"
  exit 2
fi

push_image() {
  docker image push "${REPO}/moesol/extension-scaffold/$1:$2"
}

VERSION_TAG=$1
REPO=artifacts.trmc.osd.mil/minerva-docker

echo "Pushing version ${VERSION_TAG}"
push_image es-common-extensions ${VERSION_TAG}
