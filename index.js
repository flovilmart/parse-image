var gm = require('gm').subClass({imageMagick: true});
// Require parse if undefined for the promise
if (typeof Parse == "undefined") {
	Parse = require("parse").Parse;
}
module.exports = Image = function(){}

Image.prototype.setData = function(data, options){
	var self = this;
  	return self._setData(data, undefined, options);
}

Image.prototype._setData = function(data, p, options) {
	p = p || new Parse.Promise();
	var self = this;
	self._data = data;
	self._image = gm(data);
  	self._image.size({bufferStream: true}, function(err, size){
  		self._size = size;
  		if (err) {
			if(options && options.error){
				options.error(err);
			}
			p.reject(err);
		}else{
			if(options && options.success){
				options.success(self);
			}
			p.resolve(self);
		}
  	})
  	return p;
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
	return self._wrap(cropped, options);
}

Image.prototype._callback = function(p, options){
	var self = this;
	var error = function(err){
		if(options && options.error){
			options.error(err);
		}
		p.reject(err);
	}

	return function(err, buf){
		if (err) {
			error(err);
		}else{
			self._setData(buf, p, options);
		}
	}
}

Image.prototype._wrap = function(gm, options){
	var self = this;
	var p = new Parse.Promise();
	gm.toBuffer(self._callback(p,options));
	return p;
}

Image.prototype.scale = function(options){
	var self = this;
	if(options.ratio){
		options.width = options.ratio*self.width();
		options.height = options.ratio*self.height();
	}
	return self._wrap(self._image.scale(options.width, options.height),options);
}

Image.prototype.setFormat = function(format,options){
	var self = this;
	self._image.setFormat(format.toLowerCase());
	return self._wrap(self._image, options);
}

Image.prototype.format = function(){
	return this._image.format();
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

    return self._wrap(padded, options);
}
