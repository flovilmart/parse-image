#!/bin/sh
APT=0;
BREW=0;
apt-get --version > /dev/null 2>&1 && APT=1;
brew --version > /dev/null 2>&1 && BREW=1;
if [ $BREW -eq 1 ]
then
	echo "Installing using brew...";
	brew install imagemagick; 
	brew install graphicsmagick;
elif [ $APT -eq 1 ]
then
	echo "Installing using apt-get...";
	sudo apt-get install imagemagick;
	sudo apt-get install graphicsmagick;
else
	echo "You should install imagemagick and graphicsmagick"
fi