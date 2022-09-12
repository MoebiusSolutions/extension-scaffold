#/bin/bash

set -e
SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

if (( $# < 1 )); then
  echo "Usage $0 <tag>"
  exit 2
fi

VERSION_TAG=$1
REPO=artifacts.trmc.osd.mil/minerva-docker

echo "Tagging version $1"
set -x
docker tag extension-scaffold/es-home:latest ${REPO}/moesol/extension-scaffold/es-home:${VERSION_TAG}
set +x
