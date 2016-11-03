// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var fs = require("fs");
 path = require("path");

const buttonCreated = document.getElementById('file');
const dialog = require('electron').remote.dialog;

buttonCreated.addEventListener('click', function (event) {
    var i = dialog.showOpenDialog({ properties: [ 'openFile', 'openDirectory', 'multiSelections' ]});
	test(i);
});

function test(i){
var p = i[0];

fs.readdir(p, function (err, files) {
    if (err) {
        throw err;
    }
	files.map(function (file) {
        return path.join(p, file);
    }).filter(function (file) {
        return fs.statSync(file).isFile();
    }).forEach(function (file) {
		fileext = path.extname(file).replace(".", "").toLowerCase();
		if(uploadconfig.filetypes.indexOf(fileext)===-1) return;
	
	fs.readFile(file, function(err, buffer) {
	  var blob = new File([new Uint8Array(buffer)],path.basename(file));
	   console.log(r.addFile(blob));
	});
	  
		//console.log(r.addFile(file));
    });
});
}