//#!/bin/sh
//BREW=0;
//brew --version > /dev/null 2>&1 && BREW=1;
//if [ $BREW -eq 1 ]
//then
//	echo "Installing using brew...";
//	brew install imagemagick; 
//	brew install graphicsmagick;
//else
//	echo "You should install imagemagick and graphicsmagick"
//fi

var cmd = 'brew';
var args = '--version > /dev/null 2>&1 && brew install imagemagick graphicsmagick'
var exec = require('child_process').exec,
    child;
console.log("Trying to install using brew...");
exec(cmd+' '+args,
  function (error, stdout, stderr) {
    console.log(''+stdout);
    console.log('error: '+stderr);
    if(error !== null){
        console.warn("Cannot install using brew...\n"+
                        "Please install imagemagick and "+
                        "graphicsmagick");
        console.warn("parse-image will not work properly...");
        console.warn("\n\nvisit http://www.graphicsmagick.org\n\n");
    }
});
