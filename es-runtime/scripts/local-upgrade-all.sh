#!/bin/bash

# Points all projects to a local `.tgz` build of `@moesol/es-runtime`

cd $(dirname "${BASH_SOURCE[0]}")

# Now we know where we are

BASE=`pwd`/../..

cd "${BASE}/es-runtime"
npm run build

EXAMPLES="display-rules
ext-example-angular
ext-example-lit-element
ext-example-rollup
ext-example-snowpack
ext-example-solid
ext-example-svelte
ext-example-webpack"

for e in ${EXAMPLES}; do
    EXAMPLE_DIR="${BASE}/es-extension-examples/${e}"
    echo "${EXAMPLE_DIR}"
    if [[ -f ${EXAMPLE_DIR}/package.json ]]; then
        cd "${EXAMPLE_DIR}"
        npm install -D "${BASE}/es-runtime"
    fi
  echo $f
done
