#!/bin/sh
BREW=0;
brew --version > /dev/null 2>&1 && BREW=1;
if [ $BREW -eq 1 ]
then
	echo "Installing using brew...";
	brew install imagemagick; 
	brew install graphicsmagick;
else
	echo "You should install imagemagick and graphicsmagick"
fi
