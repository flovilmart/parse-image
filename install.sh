#!/bin/bash

HAS_GM=0;
HAS_IM=0;

gm version > /dev/null 2>&1 && HAS_GM=1;
convert -version > /dev/null 2>&1 && HAS_IM=1;

if [[ "$HAS_GM" -eq "1" && "$HAS_IM" -eq "1" ]];
then
  echo "Found all dependencies";
	exit 0;
fi


INSTALL=0;
brew --version > /dev/null 2>&1 && INSTALL=1;
if [ $INSTALL -eq 1 ]
then
	echo "Installing using brew...";
	if [ "$HAS_GM" -eq "0" ]; then
		brew install graphicsmagick;
	fi

	if [ "$HAS_IM" -eq "0" ]; then
		brew install imagemagick;
	fi 
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

$APT_GET --version > /dev/null 2>&1 && INSTALL=1;
if [ $INSTALL -eq "1" ]
then
	echo "Installing using $APT_GET...";
	$APT_GET update;
	TO_INSTALL="";
	if [ "$HAS_GM" -eq "0" ]; then
		TO_INSTALL="$TO_INSTALL graphicsmagick"
	fi
	if [ "$HAS_IM" -eq "0" ]; then
		TO_INSTALL="$TO_INSTALL imagemagick"
	fi
	$APT_GET install $TO_INSTALL -y --fix-missing;
	exit 0;
fi

echo "Cannot install using brew or $APT_GET";
echo "Please install manually";

exit 0;