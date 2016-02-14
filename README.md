parse-image
===========

[![codecov.io](https://codecov.io/github/flovilmart/parse-image/coverage.svg?branch=master)](https://codecov.io/github/flovilmart/parse-image?branch=master)
[![Build Status](https://travis-ci.org/flovilmart/parse-image.svg?branch=master)](https://travis-ci.org/flovilmart/parse-image)

Port of Parse Image for parse-env based on node-gm

Auto install imagemagick and graphics magick with `homebrew` on OS X OR `apt` if available.

If the auto installation fails, you need to manually install imagemagick and graphicsmagick on you system.

## Installation

just install it as a dependency:

`$ npm install --save parse-image`

There is a pre-install script that will attepmt to use `brew` or `apt` to install the imagemagick and graphicsmagick.

If the pre-install script fails, the installation continues but the module may not be working. (actually it won't work at all) 

## Heroku installation

heroku comes with imagemagick (convert) by default. 

You need to manually install [heroku-buildpack-graphicsmagick](https://github.com/mcollina/heroku-buildpack-graphicsmagick) 

Follow the instructions in the link and the pre-install warnings should auto-magically disappear