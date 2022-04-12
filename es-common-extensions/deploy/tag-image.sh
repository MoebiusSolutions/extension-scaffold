#/bin/bash

set -e
SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

if (( $# < 1 )); then
  echo "Usage $0 <tag>"
  exit 2
fi

VERSION_TAG=$1

echo "Tagging version $1"
set -x
docker tag extension-scaffold/es-common-extensions:latest docker-dfntc.di2e.net/moesol/extension-scaffold/es-common-extensions:${VERSION_TAG}
set +x
