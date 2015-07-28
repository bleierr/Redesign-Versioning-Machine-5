	
function moveToFront($that){
	/*this function changes the stack order of a JQuery panel element and adds it to the front of all visible panels*/
	$(".activePanel").each(function(){
				$(this).css({"z-index":2, "opacity": 0.9}).removeClass("activePanel");
			});			
		$that.addClass("activePanel").css({"z-index":5, "opacity":1});
		$that.nextAll().insertBefore($that);
}
	
function totalPanelWidth(){
	/*this function calculates and returns the total panel width of visible panels*/
	
	//console.log("inside totalPanelWidth");
	var total_w = 0;
	$("div.mssPanel:not(.invisible)").each(function(){
		
		var w = $(this).width();
		var panel_id = $(this).attr("id");
		//console.log("panel " + panel_id + ": " + w);
		total_w += w;

	});
	
	//console.log("Total width of visible panels: " + total_w);
	return total_w;
}

function PanelInPosXY(selector, left, top){
	panelPresent = false;
	$(selector).each(function(){
			console.log("left top " + left + " " + top );
			var pos = $(this).position();
			console.log("pos left top " + pos.left + " " + pos.top );
			if(pos.left == left && pos.top == top){
					panelPresent = true;
			}
			
	});
	return panelPresent;
}





$.fn.dropdownButtonClick = function() {
    return this.click(function(e){
        e.stopPropagation();
		$(".dropdownButton").not(this).next(".dropdown").css('visibility', 'hidden');
		
		$(this).find("img").toggleClass("invisible");
		
		var visibility = $(this).next('ul').css('visibility');
		if ( visibility === 'hidden'){
			$(this).next('ul').css('visibility', 'visible');
		}
		else{
			$(this).next('ul').css('visibility', 'hidden');
		}
	
		$('html').click(function (e) {
			//e.stopPropagation();
			var container = $(".dropdown");

			//check if the clicked area is dropDown or not
			if (container.has(e.target).length === 0) {
				$(".dropdown").css('visibility', 'hidden');
			}
		});
    });
};

$.fn.changePanelVisibility = function(x,y) {
	/*param x and y are the coordinates where the panel should be moved to*/
	$(this).toggleClass("invisible");
	$(this).css({"opacity":0.9});
	if(!(x===undefined || y===undefined)){
	
		if($.type(x) === "string"){
			if((x.substr(-2) === "em") || (x.substr(-2) === "px")){
			x = x.slice(0,-2)
			}
		}
		if($.type(y) === "string"){
			if((y.substr(-2) === "em") || (y.substr(-2) === "px")){
				y = y.slice(0,-2)
			}
		}
		if(!isNaN(x) && !isNaN(y)){
			$(this).css({"left":x});
			$(this).css({"top":y});
			}
	}
}

$.fn.panelActionClick = function() {
    return this.click(function(){
			var datapanelid = $(this).attr("data-panelid");
			
			if(datapanelid === "linenumber"){
				$(".linenumber").toggleClass("invisible");
			}
			else{
					
				$("#"+datapanelid).each(function(){
					var y = $(this).css("top");
					var x = $(this).css("left");
					if(x === "auto" || y === "auto"){
						//if no panel is at coordinate left:0
						if(y == "auto"){
							y = $("#mainBanner").height();
						}
						x = 0;
						//"div.mssPanel:not(.invisible)"
						while(PanelInPosXY("div.panel:not(.invisible)", x, y)){
							x += 10;
							y += 10;
						}
					}
					$(this).changePanelVisibility(x, y);
					$(this).appendTo("#mssArea");
					moveToFront($(this));
				});		
				workspaceResize();
			}
			$("*[data-panelid='"+datapanelid+"']").toggleOnOff();
			
		});
	};
	
$.fn.panelActionHover = function() {
    return this.hover(function(){
		/*mouse enter event*/
		var p = $(this).attr("data-panelid");
		$(this).addClass("highlight");
		$("#"+p).addClass("highlight");
	}, function(){
		/*mouse leave event*/
		var p = $(this).attr("data-panelid");
		
		$(this).removeClass("highlight");
		$("#"+p).removeClass("highlight");
		
	});	
};


$.fn.mssPanel = function() {
    return this.each(function(){
		var $that = $(this);
		$that.mousedown(function(){
			moveToFront($that);
		});
		
		$that.hover(function(){
			$that.addClass("highlight");
			var p = $that.attr("id");
		
			$(".dropdown li[data-panelid='"+p+"']").addClass("highlight");
		
		}, function(){
			$that.removeClass("highlight");
			var p = $(this).attr("id");
			$(".dropdown li[data-panelid='"+p+"']").removeClass("highlight");
		});
	});	
};

$.fn.imgPanel = function() {
    return this.each(function(){
	
		var $that = $(this);
		var imageId = $that.attr("id");
		
		$that.mousedown(function(){
			$(".activePanel").each(function(){
				$(this).css({"z-index":2}).removeClass("activePanel");
			});
			$that.addClass("activePanel").css({"z-index":5});
			$that.nextAll().insertBefore($that);
		});
		
		$that.hover(function(){
			$("img[data-img-id='" + imageId +"']").addClass("highlight");
			$(this).addClass("highlight");
		
		}, function(){
			$("img[data-img-id='" + imageId +"']").removeClass("highlight");
			$(this).removeClass("highlight");
		});
		
	});	
};
	

/********IMAGE PANEL REWRITE wit JQUERY*********/

 
$.fn.toggleOnOff = function() {
	return $(this).each(function(){
    var b = $(this).find("button");
		var content = b.html();
		
		if (content === "ON"){
		    b.html("OFF");
		}
		if (content === "OFF"){
		    b.html("ON");
		}
		
		b.toggleClass("buttonPressed");
		});
	}
 
/*image panel functionality*/


$.fn.hoverPopup = function() {
	
	return this.hover(function(e){
		$("<div id='showNote'>empty note</div>").appendTo("body");
		var noteContent = $(this).find("div.note, div.corr, span.altRdg").html();
		
		$("#showNote").html(noteContent);
		$("#showNote").css({
			"position": "absolute",
			"top": e.pageY + 5,
			"left": e.pageX + 5,
		}).show();
	
	}, function(e){
		$("#showNote").hide();
	});
};


function workspaceResize(){

            var mssAreaWidth = $('#mssArea').width();
            
            var w = totalPanelWidth();
            
            var windowWidth = $(window).width();
            
            if( windowWidth > w){
                $('#mssArea').width(windowWidth);
            }
            else{
                $('#mssArea').width(w+100);
            }
			
			/*move panel that is outside of workspace into workspace*/
			$("div.mssPanel").each(function(idx, element){
				$ele = $(element);
				var l = $ele.position().left;
				var t = $ele.position().top;
				var w = $ele.width();
				
				if( (l + w) > windowWidth ){
					$ele.offset({top:t, left:l});
				}
			});
			/*height of workspace*/
			var panelHeight = 0;
			$(".panel").each(function(idx, element){
				var h = $(element).height();
				if(panelHeight < h){
					panelHeight = h;
				}
			});
			$("#mssArea").css({"height":panelHeight+100});
}


$.fn.match_lines = function() {
		this.click(function(){
			var line_id = $(this).attr("data-line-id");
			//add or remove attr match_hi
			$("."+line_id).toggleClass("match_hi");
		});
};


$.fn.audio_match = function() {
		/**app to add **/
		this.click(function(){
			if($(this).hasClass("match_hi")){
				var timeStart = $(this).attr("data-timeline-start");
				var timeInterval = $(this).attr("data-timeline-interval");
				
				$(this).closest(".mssPanel").find("audio").each(function(){
					var $audio = $(this);
					$audio.prop("currentTime",timeStart);
					$audio.trigger('play');
					setTimeout(function(){$audio.trigger('pause')}, 1000 * timeInterval);
					
				});
			}
		});
};

$.fn.match_app = function() {
		this.click(function(){
			var app = $(this).attr("data-app-id");
			//add or remove attr match_hi
			$("."+app).toggleClass("match_hi");
			
		});
};

$.fn.zoomPan = function() {
		this.each(function(){
			var imgId = $(this).attr("id");
			var $section = $("div#" + imgId + ".imgPanel");
            $section.find('.panzoom').panzoom({
            $zoomIn: $section.find(".zoom-in"),
            $zoomOut: $section.find(".zoom-out"),
            $zoomRange: $section.find(".zoom-range")
		});
});
};



$.fn.imgLink = function() {
		this.each(function(){
			$(this).click(function(e){
				
				var imgId = $(this).attr("data-img-id");
				$("#"+imgId).appendTo("#mssArea");
				
				$("#"+imgId).css({
					"position": "absolute",
					"top": e.pageY,
					"left": e.pageX,
					"z-index": "5"
					}).toggleClass("invisible").addClass("activePanel");
				
				
			});
			
			$(this).hover(function(){
				var panelId = $(this).attr("data-img-id");
				$(".imgPanel[id='" + panelId + "']").addClass("highlight");
			},function(){
				var panelId = $(this).attr("data-img-id");
				$(".imgPanel[id='" + panelId + "']").removeClass("highlight");
			
			});
				
		});
		
};


$(document).ready(function() {  
	/*initial setup */
	
	var bannerHeight = $("#mainBanner").height();
	
	/*The initialVisibility global can be set in settings.xsl*/
	for (item in initialVisibility){
		if(item === "versions"){
			
			/*open the witness/version panels*/
			$("#witnessList li").each(function(idx){
				var panelPos = totalPanelWidth();
				var wit = $(this).attr("data-panelid");
				if(idx < initialVisibility[item]){
					$("#"+wit).changePanelVisibility(panelPos,bannerHeight);
					$("*[data-panelid='"+wit+"']").toggleOnOff();
				}	
			});
		}
		else{
			var panelPos = totalPanelWidth();
			
			if(item === "linenumber"){
				if(initialVisibility[item]){
					$(".linenumber").toggleClass("invisible");
					$("nav *[data-panelid='linenumber']").toggleOnOff();
				}
			}
			else{
				if(initialVisibility[item]){
					$("#"+item).changePanelVisibility(panelPos,bannerHeight);
					$("nav *[data-panelid='"+ item +"']").toggleOnOff();
				}
			}
		
		}
	}
	
	
	
	
		/*close panel via X sign */
	$(".closePanel").click(function(){
		var w = $(this).closest(".panel").attr("id");
		
		$(this).closest(".panel").addClass("invisible");
		
		$("*[data-panelid='"+w+"']").toggleOnOff();
		
		workspaceResize();
		
	});
	
	workspaceResize();
	
	//initialises the dropdown functionality
	$(".dropdownButton").dropdownButtonClick();
	
	$("li[data-panelid]").panelActionClick();
	$("li[data-panelid!='linenumber']").panelActionHover();
	
	/*create popup for note, choice, etc.*/
	$("div.noteicon, div.choice, div.rdgGrp").hoverPopup();
	
	/*adds the match line or apparatus highlighting*/
	$(".apparatus").match_app();
	$(".apparatus").audio_match();

    $("li[data-panelid='notesPanel']").click(function(){

		$("#mssArea .noteicon").toggle();

	});
	
	$( ".panel" ).draggable({
		containment: "parent",
		zIndex: 6
	}).resizable(
	{helper: "ui-resizable-helper"}
	);
	
	$(".mssPanel").mssPanel();
	$(".imgPanel").zoomPan();
	$(".imgPanel").imgPanel();
	$(".imageLink").imgLink();
	
	

});


