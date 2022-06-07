#!/bin/bash
git fetch --tags
SCRIPT_DIR=$(dirname `readlink -f "$0"`)
LATEST_RELEASE=$( grep version ../es-runtime/package.json |tr -d version:,\"\ )
echo "Latest Release Version: ${LATEST_RELEASE}"
cd ${SCRIPT_DIR}/..
git checkout release
git pull
git clean -f -x -d
rush update
rush build
cd ${SCRIPT_DIR}/../rpmbuild
echo "Building RPM .."
./build.sh   
