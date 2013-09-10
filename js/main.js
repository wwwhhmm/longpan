$(document).on("pageshow", "#main_page", function(e) {
	alert("main_page pageshow");
	
	//if ( !($('#dlg_msg').length === 1) ) {
	//	$.mobile.loadPage("dlg_msg.html");
	//}
	showPV();
	
	$('#show_pv').click( function(e) {
		$('.segmented-control a').removeClass('ui-control-active');
		$(this).addClass('ui-control-active');
		showPV();
	});
	
	$('#show_cost').click( function(e) {
		$('.segmented-control a').removeClass('ui-control-active');
		$(this).addClass('ui-control-active');
		showCost();
	});
	
	$('#hot_play_list a').click( function(e) {
		//alert($(this).attr('ref-title'));
		//alert($('#dlg_msg').html());
		$('#dlg_msg h1').html('创意预览');
		$('#dlg_msg p').html( $(this).attr('ref-title')+'<br /><img src="'+$(this).attr('ref-img')+'" />' );
		//$.mobile.changePage( $("#dlg_msg"), { role: "dialog" } );
		$( "#dlg_msg" ).popup("open", { positionTo: "window", transition: "pop" });
	});
	
	$('#exit_btn').click( function(e) {
		//alert('exit app!');
		navigator.app.exitApp();
	});
});

function showPV() {
	var myvalues = [ [1,10], [2,8], [3,5], [4,7], [5,4], [6,4], [7,1] ];
	$('#chart_holder').plot([ { label: "广告观看人/次", data: myvalues }], {
		series: {
			color: 3,
			lines: { show: true },
			points: { show: true }
		},
		xaxis: {
			ticks: [[1,"07-31"], [2,"08-01"], [3,"08-02" ], [4,"08-03" ], [5,"08-04"],[6,"08-05"]]
		},
		yaxis: {
			ticks: 5,
			min: 0,
			max: 20,
			tickDecimals:0 
		},
	});
}

function showCost() {
	var myvalues = [ [1,2], [2,7], [3,5], [4,7], [5,4], [6,4], [7,3] ];
	$('#chart_holder').plot([ { label: "广告费用", data: myvalues }], {
		series: {
			color: 2,
			lines: { show: true },
			points: { show: true }
		},
		xaxis: {
			ticks: [[1,"07-31"], [2,"08-01"], [3,"08-02" ], [4,"08-03" ], [5,"08-04"],[6,"08-05"]]
		},
		yaxis: {
			ticks: 5,
			min: 0,
			max: 20,
			tickDecimals:0 
		},
	});
}