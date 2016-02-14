var assert = require('assert');
var Image = require("../index.js");


function pad() {
	var image = new Image();
	var fs = require("fs");
	var buf = fs.createReadStream("test/image.jpg");
	return image.setData(buf).then(function(image){
		return image.pad({
			left: 5,
			top: 10,
			right: 20,
			bottom: 40,
			color: "#F00"
		})
	}).then(function(image){
		assert(typeof image != 'undefined');
		return image.data()
	}).then(function(data){
		assert(typeof data != 'undefined');
    var expectedData = fs.readFileSync("./test/result-pad.jpg");
    assert(expectedData.toString('base64') == data.toString('base64'));
	})
}



describe('Image', function() {
  describe('#pad()', function() {
    it('should pad the image without error', function(done) {
		pad().then(function(){
			done();
	  }).fail(function(err){
			console.error(err);
			assert(err == undefined);
			done();
		})
    });
  });
});