#!/bin/sh
INSTALL=0;
brew --version > /dev/null 2>&1 && INSTALL=1;
if [ $INSTALL -eq 1 ]
then
	echo "Installing using brew...";
	brew install imagemagick; 
	brew install graphicsmagick;
	exit 0;
fi

APT_GET="sudo apt-get";

if [  -z "$UID" ];
then
  	APT_GET="apt-get";
elif [  "$UID" -eq "0" ];
then
	APT_GET="apt-get";
fi

$APT_GET --version && INSTALL=1;
if [ $INSTALL -eq "1" ]
then
	echo "Installing using $APT_GET...";
	$APT_GET update; 
	$APT_GET install imagemagick graphicsmagick -y --fix-missing;
	exit 0;
fi

echo "Cannot install using brew or $APT_GET";
echo "Please install manually";

exit 0;