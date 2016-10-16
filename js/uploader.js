/* Build 1.1.3 dev | 18/02/2016 */
function imgError(image) {
    image.onerror = "";
    //image.src = "/beeimg/resources/noimage.png";
	image.src = "/resources/images/noimage.png";
    return true;
	}
	
var lid = []; var urls = [];
var p = 0; var u = 0;
j(document).ready(function() {
    var pasteCatcher = j('<div/>', {
        'id': 'CV-upload-container',
        'style': 'position: absolute;top: 0px;margin: 0px;',
        'contenteditable': ''
    });
	var box = j('<div/>', {
        'id': 'box',
        'style': 'background-color:#000;; position:fixed; width:100%; height:100%; top:0px; left:0px; z-index:1000;display:none;',
    });
	var dropbox = j('<div/>', {
        'id': 'dropbox',
        'style': 'z-index: 9988; position: fixed; top: 30%; padding: 100px 200px; left: 17%;display:none;',
    });
	var style = "<style>#dropbox>.text>h1{font-size:700%;}#dropbox>.text>h2{font-size:500%;}#dropbox>.text{position:fixed;color:#fff;width:50%;left:30%;margin:-120px auto auto}#dropbox:after{content:\"\";position:fixed;width:75%;height:75%;top:0;left:0;margin:auto;bottom:0;right:0;border:10px dashed #FFF;z-index:10000;display:block}</style>";
	var cbtn = '<div id="can_btn" class="btn btn-danger btn-lg pull-left" style="z-index: 9989; position: fixed; top: 30%; left: 15%;">Close</div>';

	j('#contents').append(pasteCatcher); pasteCatcher.focus();
	j('body').append(box).append(dropbox).append(style);
    window.addEventListener("paste", handlepaste);
	
	j(function() {
    var beforeUnloadTimeout = 0 ;
    j(window).bind('beforeunload', function()  {
		    if(p===1 || u===1){
			if(p===0) r.pause();
			return 'are you sure';
			}
        beforeUnloadTimeout = setTimeout(function() {
			if(p===0) r.upload();
		  },500);
    });
    j(window).bind('unload', function() {
        if(typeof beforeUnloadTimeout !=='undefined' && beforeUnloadTimeout !== 0)
            clearTimeout(beforeUnloadTimeout);
    });
	}); 

	window.onbeforeunload = function(){
		if(p===1 || u===1){
			if(p===0) r.pause();
			 return "You're leaving the site.";
		}
	};
	
	var first = false; var second = false;
	
    j('body').on('dragenter', function(e) {
			if(first) return second = true; else first = true;
        e.originalEvent.stopPropagation();
        e.originalEvent.preventDefault();
		j("#dropbox").promise().done(function() {     
        j('#dropbox').html("<div class=\"text\"><h1 class=\"hidden-xs\">Drop the file here</h1><h2 class=\"visible-xs\">Drop the file</h2></div>").show("slow");  j('#box').show().css({ opacity: 0.9 }); 
		cb_exits = j('#can_btn').length; if(cb_exits == 0) j('body').append(cbtn); else j('#can_btn').show("fast");
			j('#can_btn').off().on('click', function() {
			j('#can_btn').hide("fast"); j('#dropbox').hide().html(""); j('#box').hide("slow");
			});
		});
    });

    j('body').on('dragleave', function(e) {
		//return false;
			if(second) second = false; else if (first) first = false;
		if (!first && !second) {
        e.originalEvent.stopPropagation();
        e.originalEvent.preventDefault();
		j('#can_btn').hide("fast"); j('#dropbox').hide().html(""); j('#box').hide("slow");
		}
    });
	
	j('body').on('drop', function(e) {
        e.originalEvent.stopPropagation();
        e.originalEvent.preventDefault();
        j('#can_btn').hide("fast");  j('#dropbox').hide("slow").html(""); j('#box').hide("slow");
    });

    j('#rupload_btn,#addurlbtn').hover(function() {
        setTimeout(function() {
            j("#upload-center").slideDown("slow");
        }, 1500);
        setTimeout(function() {
            uc_slide_up(); j('#can_btn').hide("fast"); 
        }, 12000);
    });

    function desktopnoty(title, body, icon) {
        var notycheck = notify.permissionLevel();
        if (notycheck == "default") {
            notify.requestPermission();
            Alertify.log.success(body);
            Alertify.log.info("If you like to see desktop notifications. click allow.");
        }
        if (notycheck == "granted") {
            desktopnotysend(title, body, icon);
        }
        if (notycheck == "denied") {
            Alertify.log.success(body);
        }

        function desktopnotysend(title, body, icon) {
            notify.createNotification(title, {
                body: body,
                icon: icon
            });
        }
    }

    function querror(noty, id) {
        j("#upload-center").show("slow");
        j("#upload-center").prepend('<ub id="' + id + '" class="container col-xs-12 alert alert-danger-alt text-center" style="display: none;"><h3>' + noty + '</h3></li>').find("#" + id).show("medium");
    }

    function formatSize(size) {
		if (!size) return '0 B';
        else if (size < 1024) {
            return size + ' B';
        } else if (size < 1024 * 1024) {
            return (size / 1024.0).toFixed(0) + ' KB';
        } else if (size < 1024 * 1024 * 1024) {
            return (size / 1024.0 / 1024.0).toFixed(1) + ' MB';
        } else {
            return (size / 1024.0 / 1024.0 / 1024.0).toFixed(1) + ' GB';
        }
    }

    function handlepaste(e) {
        if (e.clipboardData.items) {
            var items = (event.clipboardData || event.originalEvent.clipboardData).items;

            var blob = null;
            for (var i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") === 0) {
                    blob = items[i].getAsFile();
                }
            }
            if (blob !== null) {
                var reader = new FileReader();
                reader.onload = function(event) {
                    clipupload(event.target.result, 'base64');
                };
                reader.readAsDataURL(blob);
            }
        } else {
            j("#CV-upload-container").focus().hide();
            if (e.clipboardData.files.length === 1) {
                var file = e.clipboardData.files[0];
                if(file) clipupload(file, 'file');
            } else waitforpaste(j.makeArray(e.clipboardData.types));
        }
        return false;
    }

    function waitforpaste(e) {
        var input = j("#CV-upload-container");
        if (input.html() !== "") {
            processpaste(e);
        } else {
            that = {
                e: e
            };
            that.callself = function() {
                waitforpaste(that.e);
            };
            setTimeout(that.callself, 20);
        }
    }

    function processpaste(e) {
        var input = j("#CV-upload-container");
        var urlcheck;
        var src = input.find("img").attr("src");
        var data = input.html();
        input.html("").show();
        //var sd = (e.clipboardData.types).match(/text\/html/); console.log(sd);
        //if(e.clipboardData.types.match(/text\/html/)) console.log('true'); else console.log('false');
        if (/text\/plain/.test(e)) {
            urlcheck = data.match(/\b(https?):\/\/[[\w-\.\/]+/gi);
            j.each(urlcheck, function(index, value) {
                clipupload(value, 'url');
            });
        } else if (/base64/.test(src)) {
            clipupload(src, 'base64');
        } else {
            clipupload(src, 'url');
        }
    }

    function clipupload(data, method) {
        var unique = "clip-" + Math.ceil(Math.random() * 100 + 1);
        var item = j('#upload-center ub#' + unique);
        if (method === 'file') r.addFile(data);
        if (method === 'url') {
            if ((j.inArray(data, urls)) == -1) {
                urls.push(data);
                uploadcenter(data, 'Clipboard', unique);
                item.find('status').html('<b>Preparing</b>');
                item.find('span.thumbspace img').attr("src", data).show("slow");
                uploadurl(data, unique);
            }
        }
        if (method === 'base64') {
            uploadcenter(data, 'Clipboard', unique, 'base64');
            item.find('status').html('<b>Preparing</b>');
            item.find('span.thumbspace img').attr("src", data).show("slow");
            uploadurl(data, unique);
        }
    }

    var qu = 0;
    function uploadcenter(data, method, id, filename) {
        j("#clear-UC").show("slow");
        filesize = 0;
        if (qu == uploadconfig.maxfileuploads) {
            querror('You have added more than ' + uploadconfig.maxfileuploads + ' uploads to the queue', 'maxf');
            return false;
        }
        qu++;
        if (!filename) filename = data;
        if (filename == 'base64') filesize = ((data.length) / 4 * 3);
        if (method == 'File') methodicon = 'file';
        else if (method == 'URL' && filename != 'base64') methodicon = 'link';
        else if (method == 'Clipboard') methodicon = 'picture';
        else methodicon = 'question-sign';

        j("#upload-center").slideDown("slow");

        var listitem = '<ub id="' + id + '" class="container col-xs-12 alert alert-warning-alt" style="display: none;"><h4><i class="glyphicon glyphicon-' + methodicon + '"></i><b>' + method + '</b>: <em><span id="filedata">' + filename + '</span></em> (<span id="filesize">' + formatSize(filesize) + '</span>) <span class="progressvalue"></span></h4><div class="progress progress-striped"><div class="progress-bar progress-bar-info" role="progressbar"></div></div>' +
            '<span class="thumbspace pull-right" style="opacity: 0.7;"><img src="" style="max-width: 90px;max-height: 68px;border-radius: 5px;display:none;" onerror="imgError(this);"></img></span><p><i class="glyphicon glyphicon-transfer"></i>Status: <span class="status">Pending</span></p>' +
            '<span class="col-md-4 btn-holder btn-group"></span><span class="col-md-5 url-holder panel text-center" style="margin-bottom:-10%;padding:5px;display: none;"></span></ub>';

        j("#upload-center").prepend(listitem);
        j("#upload-center").promise().done(function() {
            j("#upload-center ub#" + id).show("medium");
        });

        if (method == 'URL' && filename != 'base64') checkurl(data, id);
    }

    function btnshow(btn, id) {
        var item = j('#upload-center ub#' + id + ' .btn-holder');
        var btnpause = '<span class="btn btn-info pause"><i class="glyphicon glyphicon-pause"></i>Pause</span>';
        var btnresume = '<span class="btn btn-success resume"><i class="glyphicon glyphicon-play"></i>Resume</span>';
        var btnrety = '<span class="btn btn-warning retry"><i class="glyphicon glyphicon-repeat"></i>Retry</span>';
        var btncancel = '<span class="btn btn-danger cancel"><i class="glyphicon glyphicon-remove-sign"></i>Cancel</span>';
        var btnremove = '<span class="btn btn-danger remove"><i class="glyphicon glyphicon-remove"></i>Remove</span>';
		var btnstart = '<span class="btn btn-info resume"><i class="glyphicon glyphicon-play"></i>start</span>';
        if ((btn === 'pause') && (item.find('.pause').length === 0)) {
            item.find('.resume').hide("slow").remove();
            item.prepend(btnpause);
        }
        if ((btn === 'resume') && (item.find('.resume').length === 0)) {
            item.find('.pause').hide("slow").remove();
            item.prepend(btnresume);
        }
        if ((btn === 'retry') && (item.find('.retry').length === 0)) {
            item.find('.pause').hide("slow").remove();
            item.prepend(btnrety);
        }
        if ((btn === 'cancel') && (item.find('.cancel').length === 0)) {
            item.find('.pause').hide("slow").remove(); j("#prog_bar").fadeOut().remove();
            item.prepend(btncancel);
        }
        if ((btn === 'remove') && (item.find('.remove').length === 0)) {
            item.find('.cancel').hide("slow").remove();
            item.find('.pause').hide("slow").remove();
            item.prepend(btnremove);
            btnfunctionsremove();
        }
        if ((btn === 'start') && (item.find('.remove').length === 0)) {
            item.find('.pause').hide("slow").remove();
			item.prepend(btnstart);
        }
    }

    function btnfunctions(file) {
        j('#' + file.uniqueIdentifier + ' .cancel').off().on('click', function(e) {
            filesintheq--; if(filesintheq!=0) { file.resume(); } file.cancel();
			console.log(filesintheq);
			if(filesintheq!=0)
			{
				pid = j('#upload-center ub:first').attr('id');
				pfile = r.getFromUniqueIdentifier(pid);
				pfile.abort();
				btnshow('start', pfile.uniqueIdentifier); btnfunctions(pfile);
				j('#' + pfile.uniqueIdentifier + '').attr('class', 'container col-xs-12 alert alert-info-alt').find('.status').text('Pending');
			}
            p=0; u=0;
            var item = j(this).parents('ub');
            j(this).remove(); if(filesintheq==0) { j("#prog_bar").fadeOut().remove(); }
            item.attr('class', 'container col-xs-12 alert alert-danger-alt').find('.status').text('Canceled');
            item.find('.progress-bar').attr('class', 'progress-bar progress-bar-danger');
            item.hide("slow");
            item.promise().done(function() {
                item.remove();
				uc_slide_up();
            });
        });
        j('#' + file.uniqueIdentifier + ' .pause').off().click(function() {
            file.abort();
            p = 1; u=1;
            var item = j(this).parents('ub');
            j(this).remove();
            item.attr('class', 'container col-xs-12 alert alert-warning-alt').find('.status').text('Paused');
            item.find('.progress-bar').attr('class', 'progress-bar progress-bar-warning');
            btnshow('resume', file.uniqueIdentifier);
            btnfunctions(file);
        });
        j('#' + file.uniqueIdentifier + ' .resume').off().click(function() {
            file.resume();
            p = 0; u=1;
            var item = j(this).parents('ub');
            j(this).remove();
            item.attr('class', 'container col-xs-12 alert alert-info-alt').find('.status').text('Resumed');
            item.find('.progress-bar').attr('class', 'progress-bar progress-bar-info');
            btnshow('pause', file.uniqueIdentifier);
            btnfunctions(file);
        });
    }

    function btnfunctionsremove() {
        j('.remove').off().on('click', function() {
            var item = j(this).parents('ub');
            j(this).remove();
            item.find('.status').text('Removeing');
            p = 0;
            item.hide("slow");
            item.promise().done(function() {
                item.remove();
                uc_slide_up();
            });
        });
    }
	function uc_slide_up() {
         setTimeout(function() {
			   if (j('#upload-center').html() === '')
			   {
                    j("#upload-center").slideUp("slow");
                    j("#clear-UC").hide("slow");
			   }
			   }, 2000);
    }
	
    function btnfunctionretry(file, url) {
        j('.retry').click(function() {
            var item = j(this).parents('ub');
            j(this).remove();
            item.attr('class', 'container col-xs-12 alert alert-info-alt').find('.status').text('Waiting for Reupload');
            item.find('div.progress-bar').attr('class', 'progress-bar progress-bar-info');
            item.find('div.progress-bar').css('width', '0%');
            item.find('span.progressvalue').text('0%');
            if (file) {
                btnshow('pause', file.uniqueIdentifier);
                btnfunctions(file); submitted = new Date().getTime();
            }
            setTimeout(function() {
                item.attr('class', 'container col-xs-12 alert alert-info-alt').find('.status').text('Starting Reupload');
                if (file) file.retry();
                else if (url) uploadurl(url, item.attr('id'));
            }, 2000);
        });
    }

    function processdata(json) {
        var pathtofile = '<a href="' + json.files.url + '" target="_blank">direct link &raquo;</a> ';
        var pathimgsite = '<a href="' + json.files.view_url + '" target="_blank">image page &raquo;</a> ';
        var pathimgthumb = '<a href="' + json.files.thumbnail_url + '" target="_blank">image thumbnail &raquo;</a> ';
        var pathtodelete = '<a href="' + json.files.delete_url + '" target="_blank">delete image &raquo;</a>';
        return (pathtofile + pathimgthumb + pathimgsite + pathtodelete);
    }
	
    var uq = 0;
    j("#addurlbtn").on("click", function() {
        var input = j("#urlholder").val();
		var dom = j("#urlholder").closest("div.input-group");
        if (input.length === 0) return false;
        j('#urlholder').prop('disabled', true);
        j('#addurlbtn').prop('disabled', true);
        var urlcheck = input.match(/\b(https?):\/\/[[\w-\.\/]+/gi);
			if (!urlcheck) { 
			dom.attr('class', 'input-group col-md-8 col-xs-12 has-error');
			j('#urlholder').prop('disabled', false);
			j('#addurlbtn').prop('disabled', false);
			return false;
			} else dom.attr('class', 'input-group col-md-8 col-xs-12 has-success');
        //var urlcheck2 = urlcheck.match(/\b(jpg|jpeg|png|gif)/gi);
        j.each(urlcheck, function(index, value) {
            var unique = "url-" + Math.ceil(Math.random() * 100 + 1);
            if ((j.inArray(value, urls)) == -1) {
                urls.push(value);
                uploadcenter(value, 'URL', unique);
                var item = j('#upload-center ub#' + unique); j("#urlholder").val("");
                item.attr('class', 'container col-xs-12 alert alert-info-alt').find('.status').text('Preparing');
                item.find('span.thumbspace img').attr("src", value).show("slow");
                uq++;
            }
        });
        j("#urlqstatus").hide().html("<b>" + uq + " urls were added</b>").slideDown("slow");
        j('#urlholder').prop('disabled', false);
        j('#addurlbtn').prop('disabled', false);
    });

    function uploadurl(imgurl, id) {
        var item = j('#upload-center ub#' + id);
        j.ajax({
            xhr: function() {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function(evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        var percentage = Math.floor(percentComplete * 100);
                        if (percentComplete === 1) item.find('.status').text('File Uploaded');
                        item.find('div.progress-bar').css('width', percentage + '%');
                        item.find('span.progressvalue').text(percentage + '%');
                    }
                }, false);
                return xhr;
            },
            //url: "https://" + uploadconfig.server + "/beeimg/new/uploadtest.php",
            url: "//"+uploadconfig.server+"/api/upload/url/json/",
            type: "POST",
            dataType: 'json',
            cache: false,
            async: true,
            beforeSend: function() {
                item.find('.status').text('Requesting System Upload'); u=1;
            },
            data: {
                url: imgurl,
            },
            success: function(json) {
                btnshow('remove', id); u=0;
                if (json.files.code == 200) {
                    lid.push(json.files.name);
                    item.attr('class', 'container col-xs-12 alert alert-success-alt').find('.status').text('Done');
                    item.promise().done(function() {
                        item.find('.url-holder').html(processdata(json)).show(1000).css('display', '');
                    });
                    item.find('.btn-holder .cancel').html('<i class="glyphicon glyphicon-remove"></i> Remove');
                    item.find('span.thumbspace img').hide().attr("src", json.files.thumbnail_url).show(1500).css('display', '');
                    item.find('span.thumbspace').css('opacity', '1');
                    item.find('#filesize').text(formatSize(json.files.size));
                    //desktopnoty("Image Uploaded","Image "+ json.files.name +" has been uploaded to BeeIMG",json.files.thumbnail_url);
                    item.find('.progress-bar').attr('class', 'progress-bar progress-bar-success');
                } else {
                    item.attr('class', 'container col-xs-12 alert alert-danger-alt').find('.status').html('Failed!! | ' + json.files.status + ' code:' + json.files.code);
                    item.find('.progress-bar').attr('class', 'progress-bar progress-bar-danger');
                    item.find('span.thumbspace').css('opacity', '0.5');
                    btnshow('retry', id);
                    btnfunctionretry('', imgurl);
                }
            }
        });
    }

    function checkurl(url, id) {
        var item = j('#upload-center ub#' + id);
        j.ajax({
            url: "//"+uploadconfig.server+"/uploader/urlcheck",
            //url: "https://" + uploadconfig.server + "/beeimg/new/uploadtest.php?fs",
            type: "POST",
            dataType: "json",
            cache: false,
            data: {
                uniqueid: id,
                url: url,
            },
            success: function(json) {
                item.attr('class', 'container col-xs-12 alert alert-info-alt').find('.status').text('Checking URL');
                if (json.code == 200) {
                    item.find('#filesize').text(formatSize(json.size));
                    uploadurl(url, id);
                } else if (json.code == 720) {
                    item.hide();
                    querror(url + ' is not an image, please upload files which are ' + (uploadconfig.filetypes) + '', 'maxfs');
				} else if (json.code == 503) {
                    item.hide();
                    querror('the host of ' + url + ' is blocked, please contact admin for more info', 'hostblocked');
                } else if (json.code == 625) {
                    item.hide();
                    querror(url + ' is too large, please upload files less than ' + formatSize(uploadconfig.maxfilesize) + '', 'maxfs');
                } else {
                    Alertify.log.danger("OH! :O There was a unexpected error :(");
                }
            }
        });
    }

    function resizedataURL(datas, wantedWidth, wantedHeight, id) {
        var img = new Image();
        img.onload = function() {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.width = wantedWidth;
            canvas.height = wantedHeight;
            ctx.drawImage(this, 0, 0, wantedWidth, wantedHeight);
            var dataURI = canvas.toDataURL();
            j('#upload-center ub#' + id + ' span.thumbspace').promise().done(function() {
                j('#upload-center ub#' + id).find('span.thumbspace img').attr("src", dataURI).show("slow");
            });
        };
        img.src = datas;
    }

    var r = new Resumable({ //mobile chuck size vs desktop
        target: "http://" + uploadconfig.server + "/uploadtest.php",
        //target: "//"+uploadconfig.server+"/uploader/resumable/upload",
        maxFileSize: uploadconfig.maxfilesize,
        maxFiles: uploadconfig.maxfileuploads,
        fileType: uploadconfig.filetypes,
        chunkSize: uploadconfig.chunksize,
        simultaneousUploads: uploadconfig.simultaneousuploads,
        maxFilesErrorCallback: function(file, errorCount) {
            var maxFiles = r.getOpt('maxFiles');
            querror('Please upload ' + maxFiles + ' file' + (maxFiles === 1 ? '' : 's') + ' at a time.', 'maxf');
        },
        minFileSizeErrorCallback: function(file, errorCount) {
            querror(file.fileName || file.name + ' is too small, please upload files larger than ' + formatSize(r.getOpt('minFileSize')) + '.', 'minfs');
        },
        maxFileSizeErrorCallback: function(file, errorCount) {
            querror(file.fileName || file.name + ' is too large, please upload files less than ' + formatSize(r.getOpt('maxFileSize')) + '.', 'maxfs');
        },
        fileTypeErrorCallback: function(file, errorCount) {
            querror(file.fileName || file.name + ' has type not allowed, please upload files of type ' + r.getOpt('fileType') + '.', 'ftype');
        }
    });

    r.assignBrowse(document.getElementById("rupload_btn"));
    r.assignDrop(document.body);

    if (!r.support) alert("use the old uploader");

    var fq = 1; var filesintheq = 0; var submitted; var perc=0; var chuckstarttime=0; var chunks=0; var pspeed=1;
    r.on('chunkingStart', function(file) {
        j("#clear-UC").show("slow");
        j("#fileqstatus").hide().html("<b>" + fq + " files were added</b>").slideDown("slow");
        fq++;
        j('#myTab a[href="#resumable"]').tab('show');
        uploadcenter(file.fileName, 'File', file.uniqueIdentifier);
        var item = j('#upload-center ub#' + file.uniqueIdentifier);
        item.attr('class', 'container col-xs-12 alert alert-info-alt').find('.status').text('Preparing');
        btnshow('cancel', file.uniqueIdentifier);
        btnfunctions(file);
    });
    r.on("fileAdded", function(file, event) {
        var item = j('#upload-center ub#' + file.uniqueIdentifier); filesintheq++;
		j("#upload-center").prepend('<div id="prog_bar"><div class="progress progress-striped"><div style="width: '+perc+'%;" class="progress-bar progress-bar-primary" role="progressbar"></div></div></div>');
        var reader = new FileReader();
        reader.onloadend = function() {
			if(reader.result.length>5000000){ setTimeout(function() {
				resizedataURL(reader.result, 50, 50, file.uniqueIdentifier);
			}, 1500);
			}
        };
        reader.readAsDataURL(file.file);

        item.find('.status').text('Pending');
        item.find('#filesize').text(formatSize(file.size));
        if (p === 0) r.upload();
		//console.log(p);
        btnshow('pause', file.uniqueIdentifier);
        item.find('.btn-holder .pause').attr('disabled', true);
        item.find('span.progressvalue').text('0%');
		if(u==0) submitted = new Date().getTime();
		//console.log(file.isUploading);
    });
    r.on('fileProgress', function(file) {
		if(!file.uniqueIdentifier) file = file.fileObj;
        var item = j('#upload-center ub#' + file.uniqueIdentifier);
        if (file.progress() === 0) item.find('.status').text('Starting Upload');
        item.find('.progress-bar').attr('class', 'progress-bar progress-bar-info');
        btnshow('pause', file.uniqueIdentifier);
        btnfunctions(file); u = 1;
		var now = new Date().getTime();
		var timeSpent_sincestart = now - submitted;
		var timeSpent_between_chunks = now - chuckstarttime;
		if((chunks%uploadconfig.simultaneousuploads) === 0) {
			var speed = Math.round( uploadconfig.chunksize*1024 / ( ( timeSpent_between_chunks*1000 ) ) ); //console.log(speed); console.log(timeSpent_between_chunks); 
			chuckstarttime = now; pspeed = speed;
			} else { var speed = pspeed; } chunks++;
		var time_remaining = Math.round(((timeSpent_sincestart / file.progress()) - timeSpent_sincestart) / 1000);
		if (time_remaining>60) { min = Math.floor(time_remaining / 60); sec = (time_remaining % 60); cqps_ = min+' minutes and '+ sec+' seconds'; } else { sec = Math.floor(time_remaining / 1); cqps_ = sec+' seconds'; } 
        item.find('.btn-holder .pause').attr('disabled', false);
        item.attr('class', 'container col-xs-12 alert alert-info-alt').find('.status').text('Uploading ('+ cqps_ +' remaining) '+ speed +' kbps');
        var percentage = Math.floor(file.progress() * 100);
        if (file.progress() === 1) item.find('.status').text('Merging Uploaded Files');
        item.find('div.progress-bar').css('width', percentage + '%');
        item.find('span.progressvalue').text(percentage + '%');
    });
    r.on("fileSuccess", function(file, message) {
		if(!file.uniqueIdentifier) file = file.fileObj;
        var item = j('#upload-center ub#' + file.uniqueIdentifier); u = 0;
        j.ajax({
            url: "http://" + uploadconfig.server + "/uploadtest.php",
            //url: "//"+uploadconfig.server+"/uploader/resumable/complete",
            type: "POST",
            dataType: "json",
            cache: false,
            beforeSend: function() {
                item.find('.status').text('Requesting System Upload');
            },
            data: {
                uniqueid: file.uniqueIdentifier,
                message: message,
            },
            success: function(json) {
                btnshow('remove', file.uniqueIdentifier);
                if (json.files.code == 200) {
                    lid.push(json.files.name); filesintheq--;
                    item.attr('class', 'container col-xs-12 alert alert-success-alt').find('.status').text('Done');
                    item.promise().done(function() {
                        item.find('.url-holder').html(processdata(json)).show(1000).css('display', '');
                    });
                    item.find('span.thumbspace img').hide().attr("src", json.files.thumbnail_url).show(1500).css('display', '');
                    item.find('span.thumbspace').css('opacity', '1');
                    item.find('#filesize').text(formatSize(json.files.size));
                    desktopnoty("Image Uploaded", "Image " + json.files.name + " has been uploaded to BeeIMG", json.files.thumbnail_url);
                    item.find('.progress-bar').attr('class', 'progress-bar progress-bar-success');
                } else {
                    item.attr('class', 'container col-xs-12 alert alert-danger-alt').find('.status').html('Failed!! | ' + json.files.status + ' code:' + json.files.code);
                    item.find('.progress-bar').attr('class', 'progress-bar progress-bar-danger');
                    item.find('span.thumbspace').css('opacity', '0.5');
                    btnshow('retry', file.uniqueIdentifier);
                    btnfunctionretry(file, '');
                }
            }
        });
		submitted = new Date().getTime();
    });

    r.on('fileError', function(file, message) {
	 querror(message, 'fileerror'); btnfunctionretry(file, '');
    });

    r.on('Progress', function() {
		var percentage = Math.floor(this.progress() * 100); perc=percentage;
        j("#prog_bar").find('div.progress-bar').css('width', percentage + '%');
        j("#prog_bar").find('span.progressvalue').text(percentage + '%');
		//console.log(this.progress()); 
    });
    r.on("Complete", function() {
		j("#prog_bar").fadeOut().remove();
        j('#btn-holder .pause').hide();
        if(qu!==0) j("#clear-UC").show("slow");
    });

    j("#clear-UC").off().on("click", function() {
        lid.splice(0, lid.length);
        r.cancel(); j("#prog_bar").fadeOut().remove();
        j(this).hide("slow");
        j("#upload-center").slideUp("slow");
        j("#upload-center").promise().done(function() {
            j("#upload-center").find("ub").remove();
        });
    });
});