var gm = require('gm').subClass({imageMagick: true});
// Require parse if undefined for the promise
if (typeof Parse == "undefined") {
	Parse = require("parse").Parse;
}

module.exports = Image = function(){}

Image.prototype.setData = function(data, options){
  return _setData(this, data, undefined, options);
}

Image.prototype.width = function(){
	return this._size.width;
}

Image.prototype.height = function(){
	return this._size.height;
}

Image.prototype.data = function(){
	return this._data;
}

Image.prototype.crop = function(options){
	var self = this;
	var w = options.width;
	var h = options.height;
	var l = options.left || 0;
  var t = options.top || 0;

  	var r = options.right || 0;
  	var b = options.bottom || 0;
    if (!options.width) {
    	w = self.width()-r-l;
    }
    if (!options.height) {
    	h = self.height()-b-t;
    }
  var cropped = self._image.crop(w,h,l,t);
	return _wrap(self, cropped, options);
}

Image.prototype.scale = function(options){
	var self = this;
	if(options.ratio){
		options.width = options.ratio*self.width();
		options.height = options.ratio*self.height();
	}
	return _wrap(self, self._image.scale(options.width, options.height),options);
}

Image.prototype.setFormat = function(format,options){
	var self = this;
	self._image.setFormat(format.toLowerCase());
	return _wrap(self, self._image, options);
}

Image.prototype.format = function(options){
  var p = new Parse.Promise();
	this._image.format(callbackify(p, options));
  return p;
}

Image.prototype.pad = function(options) {
	var self = this;
	var w = options.width;
	var h = options.height;
	var l = options.left || 0;
  	var t = options.top || 0;

  	var r = options.right || 0;
  	var b = options.bottom || 0;

    if (!options.width) {
    	w = self.width()+r+l;
    }
    if (!options.height) {
    	h = self.height()+b+t;
    }

    var padded = self._image.out("-background", options.color)
    	.borderColor(options.color)
    	.border(l, r)
    	.extent(w, h)
    	.out("-flatten")

    return _wrap(self, padded, options);
}


var _setData = function(self, data, p, options) {
	p = p || new Parse.Promise();
	self._data = data;
	self._image = gm(data);
  self._image.size({bufferStream: true}, function(err, size){
  	self._size = size;
    callbackify(p, options)(err, self);
  });
  return p;
}

var _callback = function(self, p, options){
  options = options || {};

	return function(err, buf){
		if (err) {
			options.error && options.error(err);
		  p.reject(err);
		}else{
			_setData(self, buf, p, options);
		}
	}
}

var _wrap = function(self, gm, options){
	var p = new Parse.Promise();
	gm.toBuffer(_callback(self, p, options));
	return p;
}

var callbackify = function(p, options) {
  options = options || {};
  return function(err, res) {
    if (err) {
      options.error && options.error(err);
      return p.reject(err);
    } else {
      options.success && options.success(err);
      return p.resolve(res);
    }
  };
}

