#!/bin/bash

cd $(dirname "${BASH_SOURCE[0]}")

# Now we know where we are

pwd

BASE=../../

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
        npm install @gots/es-runtime@latest
    fi
  echo $f
done

cd ${BASE}/es-application-examples/es-demo/
npm install @gots/es-runtime@latest