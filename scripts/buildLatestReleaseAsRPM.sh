#!/bin/bash
git fetch --tags
LATEST_RELEASE=$(git describe --tags `git rev-list --tags --max-count=1`)
echo "Latest Release: ${LATEST_RELEASE}"
git switch ${LATEST_RELEASE} 
cd ../es-home
echo "Building release .."
npm ci
npm run build
cd ../buildrpm
echo "Building RPM .."
./build.sh   
