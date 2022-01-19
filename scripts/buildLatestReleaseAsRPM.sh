#!/bin/bash
git fetch --tags
SCRIPT_DIR=$(dirname `readlink -f "$0"`)
LATEST_RELEASE=$(git describe --tags `git rev-list --tags --max-count=1`)
echo "Latest Release: ${LATEST_RELEASE}"
git checkout ${LATEST_RELEASE} 
cd ${SCRIPT_DIR}/../es-home
echo "Building release .."
npm ci
npm run build
cd ${SCRIPT_DIR}/../buildrpm
echo "Building RPM .."
./build.sh   
