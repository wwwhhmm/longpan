document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	$(document).ready( function() {
		alert(device.platform);
	    if (checkConnection() == Connection.NONE ) {
	    	workingStatus.isConnected = false;
	    	$.mobile.changePage("views/login.html");
	    } else {
	    	workingStatus.isConnected = true;
	    	checkUpdate();
	    }
	});
}

function checkConnection() {
	var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    alert('Connection type: ' + states[networkState]);
    return networkState;
}

var version = {
	v_online: '',
	v_local: '',
	v_description: '',
	v_apk: ''
};

function getUpdatable(url,key) {
	var dtd = $.Deferred();
	if (workingStatus.isConnected) {
		$.get(url)
			.done( function(xml) {
				version.v_online = $(xml).find(key).text();
				version.v_apk = $(xml).find("apk").text();
				version.v_description = $(xml).find("description").text();
				//获取本机版本
				version.v_local = window.localStorage.getItem(key);
				if ( version.v_local == null ) {
					version.v_local = '0.0.1';
				}
				
				//比较版本异同
				if ( version.v_local != version.v_online ) {
					dtd.resolve();
				}else {
					dtd.reject();
				}
			})
			.fail( function() {
				alert('get update.xml failed!['+url+']');
				dtd.reject();
			});
	} else {
		dtd.reject();
	}
	return dtd.promise();
}


function checkUpdate() {
	$.when(getUpdatable(initOptions.updateSite+'/'+ device.platform +'/update.xml','version'))
		.done( function () { updateVersion(); } )
		.fail( function () { alert("don't update!"); } )
		//.always( function () { alert("always to login.html!"); $.mobile.changePage("views/login.html"); } )
}

function reqRoot() {
	var dtd = $.Deferred();
	window.requestFileSystem( LocalFileSystem.PERSISTENT, 0, 
		function(fileSystem) {
			//alert('fs over!');
			dtd.resolve(fileSystem.root);
		},
		function(evt) {
			console.log('reqRoot:' +evt.target.error.code);
			alert('reqRoot:' +evt.target.error.code);
			dtd.reject();
		}
	);
	return dtd.promise();
}

function mkDir( entrydir, dir ) {
	var dtd = $.Deferred();
	entrydir.getDirectory( dir, {create:true,exclusive:false},
		function(currentdir) {
			//alert('mkDir('+ dir+ ') over');
			dtd.resolve(currentdir);
		},
		function(evt) {
			console.log( 'mkDir('+ dir+ '):' + evt.target.error.code);
			dtd.reject();
		}
	);
	return dtd.promise();
}

function createFile( entrydir, fname ) {
	var dtd = $.Deferred();
	entrydir.getFile( fname, {create:true,exclusive:false},
		function(entry) {
			//alert('createFile('+ fname+ ') over');
			dtd.resolve(entry);
		},
		function(evt) {
			console.log( 'createFile('+ fname+ '):' + evt.target.error.code);
			dtd.reject();
		}
	);
	return dtd.promise();
}

function updateVersion() {
	alert('update Version!');
	
	$.when(reqRoot())
		.done( function (entrydir) {
			$.when(mkDir(entrydir, "longpan")) //下载目录一级
				.done( function (entrydir2) {
					$.when(mkDir(entrydir2, "update")) //下载目录二级
						.done( function (entrydir3) {
							$.when(createFile(entrydir3, version.v_apk ))
								.done( downloadApp ); //下载文件
						});
				});
		})
		.always( function () { alert("go to next!"); });
}

function downloadApp(entry) {
	alert("start download...");
	var fileTransfer = new FileTransfer();
	var uri = encodeURI(initOptions.updateSite +'/'+ entry.name);

	fileTransfer.onprogress = function(progressEvent) {  
		if (progressEvent.lengthComputable) {
			var percentLoaded = Math.round(100 * (progressEvent.loaded / progressEvent.total));  
			var progressbarWidth = percentLoaded/2 + "%";  

			$.mobile.showPageLoadingMsg('a', "正在下载...."+progressbarWidth,true);

			if(progressbarWidth==100) {
				//设置延时  
				setTimeout("$.mobile.hidePageLoadingMsg()",3000);  
			}
		} else {  
			loadingStatus.increment();  
		}
	};

	fileTransfer.download( uri, entry.fullPath,
		function(entry){
			alert("下载成功！");
			//调用自动安装的插件   
			window.plugins.update.openFile(entry.fullPath,null,null);
			window.localStorage.setItem('version',version.v_online);
		},
		function(error) {
			console.log("download error source " + error.source);
			console.log("download error target " + error.target);
			console.log("upload error code" + error.code);
			alert("下载失败！");
			$.mobile.changePage("views/login.html");
		}
	);
}
