#!/bin/bash
git fetch --tags
SCRIPT_DIR=$(dirname `readlink -f "$0"`)
LATEST_RELEASE=$( grep version ../es-runtime/package.json |tr -d version:,\"\ )
echo "Latest Release Version: ${LATEST_RELEASE}"
git checkout release
cd ${SCRIPT_DIR}/../es-home
echo "Building release .."
npm ci
npm run build
cd ${SCRIPT_DIR}/../rpmbuild
echo "Building RPM .."
./build.sh   
