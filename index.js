var sharp = require('sharp');
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
  return this._image.toBuffer();
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
  var cropped = self._image.extract({
    left: parseInt(l), 
    top: parseInt(t), 
    width: parseInt(w), 
    height: parseInt(h)
  });
  return _wrap(self, cropped, options);
}

Image.prototype.quality = function(quality, options) {
  var self = this;
  return _wrap(self, self._image.quality(quality), options);
}

Image.prototype.scale = function(options){
  var self = this;
  if(options.ratio){
    options.width = options.ratio*self.width();
    options.height = options.ratio*self.height();
  }
  var scaledImg = self._image.resize(parseInt(options.width), parseInt(options.height));
  return _wrap(self, scaledImg, options);
}

Image.prototype.setFormat = function(format,options){
  var self = this;
  self._image.toFormat(format.toLowerCase());
  return _wrap(self, self._image, options);
}

Image.prototype.format = function(options){
  var p = new Parse.Promise();
  this._image.metadata(function(err, metadata) {
    callbackify(p, options)(err, (metadata.format && metadata.format.toUpperCase()));
  });
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

  if (w) {
    r = options.width - self.width();
  }
  if (h) {
    b = options.height - self.height();
  }

  var padded = self._image.background(options.color)
    .extend({
      top: parseInt(t), 
      bottom: parseInt(b), 
      left: parseInt(l), 
      right: parseInt(r)
    });

  return _wrap(self, padded, options);
}


var _setData = function(self, data, p, options) {
  p = p || new Parse.Promise();
  self._data = data.path || data;
  self._image = sharp(self._data);
  self._image.metadata(function(err, metadata){
    if (!err && (!metadata || !metadata.width)) {
      err = true;
    }
    self._size = { 
      width: metadata && metadata.width,
      height: metadata && metadata.height 
    };
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

var _wrap = function(self, image, options){
  var p = new Parse.Promise();
  image.toBuffer(_callback(self, p, options));
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
