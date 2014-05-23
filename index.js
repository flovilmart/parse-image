var gm = require('gm')

module.exports = Image = function(data){
	this.setData(data);
}

Image.prototype.setData = function(data, options){
	var self = this;
	var p = new Parse.Promise();
  	this._image = gm(data,'');
  	this._image.size(function(err, size){
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
	var p = new Parse.Promise();
	console.log(options);
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
    console.log(w+" "+h+" "+l+" ")
    //self.size = {width: w, height:h}
	self._wrap(self._image.crop(w,h,l,t), p, options);
	return p;
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
		self._data = buf;
		if (err) {
			error(err);
		}else{
			self._image = gm(buf);
			self._image.size(function(err, size){
				if (err) {
					error(err);
				}else{
					self._size = size;
					if(options && options.success){
						options.success(self);
					}
					p.resolve(self);
				}
			});
		}
	}
}

Image.prototype._wrap = function(gm,p,options){
	var self = this;
	gm.toBuffer(self._callback(p,options));
}

Image.prototype.scale = function(options){
	var self = this;
	var p = new Parse.Promise();
	var p1 = Parse.Promise.as();
	if(options.ratio){
		options.width = options.ratio*self.width();
		options.height = options.ratio*self.height();
	}
	//self._size = {width: options.width, height: options.height}
	self._wrap(self._image.scale(options.width, options.height),p,options);
	return p;
}

Image.prototype.setFormat = function(format,options){
	var self = this;
	var p = new Parse.Promise();
	self._image.setFormat(format.toLowerCase());
	self._wrap(self._image,p,options);
	return p;
}

Image.prototype.format = function(){
	return this._image.format();
}
