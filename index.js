var gm = require('gm').subClass({ imageMagick: true });

// Require parse if undefined for the promise
if (typeof Parse == 'undefined') {
  Parse = require('parse').Parse;
}

module.exports = Image = function() {}

Image.prototype.setData = function(data, options) {
  return _setData(this, data, options);
}

Image.prototype.width = function() {
  return this._size.width;
}

Image.prototype.height = function() {
  return this._size.height;
}

Image.prototype.data = function() {
  return Promise.resolve(this._data);
}

Image.prototype.crop = function(options) {
  const self = this;
  let w = options.width;
  let h = options.height;
  const l = options.left || 0;
  const t = options.top || 0;

  const r = options.right || 0;
  const b = options.bottom || 0;

  if (!options.width) {
    w = self.width() - r - l;
  }

  if (!options.height) {
    h = self.height() - b - t;
  }

  const cropped = self._image.crop(w, h, l, t);
  return _wrap(self, cropped, options);
}

Image.prototype.quality = function(quality, options) {
  const self = this;
  return _wrap(self, self._image.quality(quality), options);
}

Image.prototype.scale = function(options) {
  const self = this;
  if (options.ratio) {
    options.width = options.ratio * self.width();
    options.height = options.ratio * self.height();
  }
  return _wrap(self, self._image.scale(options.width, options.height), options);
}

Image.prototype.setFormat = function(format, options) {
  const self = this;
  self._image.setFormat(format.toLowerCase());
  return _wrap(self, self._image, options);
}

Image.prototype.format = function(options) {
  const self = this;
  return new Promise(
    (resolve, reject) => {
      self._image.format((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    }
  );
}

Image.prototype.pad = function(options) {
  const self = this;
  let w = options.width;
  let h = options.height;
  const l = options.left || 0;
  const t = options.top || 0;

  const r = options.right || 0;
  const b = options.bottom || 0;

  if (!options.width) {
    w = self.width() + r + l;
  }
  if (!options.height) {
    h = self.height() + b + t;
  }

  const padded = self._image.out('-background', options.color)
    .borderColor(options.color)
    .border(l, r)
    .extent(w, h)
    .out('-flatten');

  return _wrap(self, padded, options);
}

Image.prototype.rotate = function(color, degree, options) {
  const self = this;
  const rotated = self._image.rotate(color, degree);
  return _wrap(self, rotated, options);
}

var _wrap = (self, gm, options) => {
  return new Promise(
    (resolve, reject) => {
      gm.toBuffer((err, buf) => {
        if (err) {
          reject(err);
        } else {
          resolve(_setData(self, buf, options));
        }
      });
    }
  );
}

var _setData = (self, data, options) => {
  return new Promise(
    (resolve, reject) => {
      self._data = data;
      self._image = gm(data);
      self._image.size({ bufferStream: true }, (err, size) => {
        self._size = size;

        if (err) {
          reject(err);
        } else {
          resolve(self);
        }
      });
    }
  );
}
