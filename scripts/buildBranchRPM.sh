#!/bin/bash
git fetch --tags
SCRIPT_DIR=$(dirname `readlink -f "$0"`)
BRANCH=$( grep version ../es-runtime/package.json |tr -d version:,\"\ )
echo "current branch: ${BRANCH}"
cd ${SCRIPT_DIR}/..
git pull
git clean -f -x -xd
rush update
rush build
cd ${SCRIPT_DIR}/../rpmbuild
echo "Building RPM .."
./build.sh   
