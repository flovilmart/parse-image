var assert = require('assert');
var Image = require("../index.js");
var imageDiff = require('image-diff');
var fs = require("fs");

var CreateImage = function() {
	var buf = fs.createReadStream("test/image.png");
  var image = new Image();
	return image.setData(buf);
}

var TestManipulation = function(manipulation, resultFile, comparisonFile) {
  return CreateImage().then(function(image){
    return manipulation(image);
  }).then(function(image){
    assert(typeof image != 'undefined');
		return image.data()
  }).then(function(data){
    assert(typeof data != 'undefined');
    fs.writeFileSync(resultFile, data);
    var promise = new Parse.Promise();
    imageDiff({
      actualImage: resultFile,
      expectedImage: comparisonFile
    }, function(err, res){
      assert(res == true);
      if (err) {
        promise.reject(err);
      } else {
        promise.resolve(res);
      }
    })
    return promise;
  });
}

function pad() {
  return TestManipulation(function(image){
    return image.pad({
			left: 5,
			top: 10,
			right: 20,
			bottom: 40,
			color: "#F00"
		})
  },"./result-pad.png",  "./test/result-pad.png");
}

function padTo(width, height) {
  return TestManipulation(function(image){
    return image.pad({
			width: width,
      height: height,
			color: "#F00"
		})
  },"./result-pad-"+width+"-"+height+".png",  "./test/result-pad-"+width+"-"+height+".png");
}

function crop() {
  return TestManipulation(function(image){
    return image.crop({
			left: 5,
			top: 10,
			right: 20,
			bottom: 40
		})
  },"./result-crop.png",  "./test/result-crop.png");
}

function cropTo(width, height) {
  return TestManipulation(function(image){
    return image.crop({
      width: width,
      height: height
		})
  },"./result-crop-"+width+"-"+height+".png",  "./test/result-crop-"+width+"-"+height+".png");
}

function quality(quality) {
    return TestManipulation(function(image) {
        return image.quality(quality);
    },"./result-quality.png", "./test/result-quality.png");
}

function scale() {
  return TestManipulation(function(image){
    return image.scale({
			ratio: 0.5
		})
  },"./result-scale.png",  "./test/result-scale.png");
}

function scaleWith(width, height) {
  return TestManipulation(function(image){
    return image.scale({
			width: width,
      height: height
		})
  },"./result-scale-"+width+"-"+height+".png",  "./test/result-scale-"+width+"-"+height+".png");
}


describe('Image', function() {

  describe('#pad()', function() {
    it('should pad the image without error', function(done) {
		pad().then(function(){
			done();
	  }).fail(function(err){
			assert(err == null);
			done();
		})
    });
  });

  describe('#pad()', function() {
    it('should pad the image without error', function(done) {
		padTo(400, 500).then(function(){
			done();
	  }).fail(function(err){
			assert(err == null);
			done();
		})
    });
  });

  describe('#crop()', function() {
    it('should crop the image without error', function(done) {
		crop().then(function(){
			done();
	  }).fail(function(err){
			assert(err == null);
			done();
		})
    });
  });

  describe('#crop()', function() {
    it('should crop the image without error', function(done) {
		cropTo(100, 200).then(function(){
			done();
	  }).fail(function(err){
			assert(err == null);
			done();
		})
    });
  });

  describe('#quality()', function() {
    it('should change quality without error', function(done) {
      quality(50).then(function() {
        done();
      }).fail(function(err) {
        assert(err == null);
        done();
      });
    });
  });

  describe('#scale()', function() {
    it('should scale the image at a ratio', function(done) {
		scale().then(function(){
			done();
	  }).fail(function(err){
			assert(err == null);
			done();
		})
    });
  });

  describe('#scale()', function() {
    it('should scale the image at a width and height', function(done) {
		scaleWith(200, 100).then(function(){
			done();
	  }).fail(function(err){
			assert(err == null);
			done();
		})
    });
  });

  describe('#setData()', function() {
    it('should fail setting wrong data', function(done) {
		  var image = new Image();
      var buf = new Buffer("abc", 'utf-8');
      var errHit = 0;
      image.setData(buf, {
        sucess: function(){
          errHit++;
        },
        error: function(err){
          errHit++;
        }
      }).then(function(){
        assert(false, "Should not succeed");
        done();
      }, function(err){
        assert.equal(1, errHit);
        done();
      })
    });
  });

  describe('#setFormat()', function() {
    it('should set the format to JPEG', function(done) {
		  CreateImage().then(function(image){
        return image.setFormat("jpeg");
      }).then(function(image){
        return image.format();
      }).then(function(format){
        assert.equal("JPEG", format);
        done();
      })
    });
  });
});
