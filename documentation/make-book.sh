#!/bin/bash

#
# This command turns all of these markdown files into a single PDF
#

#
# Note: cover.jpg was created using:
#
# sudo apt install graphicsmagick-imagemagick-compat
#
# npx md-to-pdf cover.md
# convert -density 300 -quality 100 cover.pdf cover.jpg 
#

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd ${SCRIPT_DIR}
docker run -v `pwd`:`pwd` -w `pwd` -it honkit/honkit honkit build
docker run -v `pwd`:`pwd` -w `pwd` -it honkit/honkit honkit pdf
# Use cp so new file is owned by me instead of root
cp book.pdf extension-scaffold.pdf
rm -f book.pdf
