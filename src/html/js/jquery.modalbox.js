/*
 * Modal box  - jQuery plugin for flyout windows
 *  
 * Author: Anoop Chauhan
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 *	Version 1.0
 */


(function($) {
    
		$.fn.modalBox =  function(settings){
			
			
			var settings = jQuery.extend({
																												
			// Configuration related to Flyout
			flyoutWidth:	700,
			flyoutHeight:	200,
			flyoutBgColor: '#000',		
			flyoutOpacity:	0.8,		
			flyoutResizeSpeed:	400
			},settings);
			
			var _dim;
			var _title;
			
			var ie55 = (navigator.appName == "Microsoft Internet Explorer" && parseInt(navigator.appVersion) == 4 && navigator.appVersion.indexOf("MSIE 5.5") != -1);
			var ie6 = (navigator.appName == "Microsoft Internet Explorer" && parseInt(navigator.appVersion) == 4 && navigator.appVersion.indexOf("MSIE 6.0") != -1);
				
			//Bind Click funciton on every instance
			$(this).each(function(){
					$(this).click(function(){
					if($(this).attr("href")!="#"){
					if (jQuery.browser.msie && (ie55 || ie6)) {$('embed, object, select').css({ 'visibility' : 'hidden' });}

					_dim = $(this).attr("rel");
					
					_title = $(this).text();
					
					_setBase();
					
					$("#modalbox-content").load($(this).attr("href"));
			
					return false;
					}
					});
			});
			
		
		function _setBase(){
						
			$('body').append('<div id="modalbox-flyout"></div><div id="modalbox"><a href="#" title="Close" id="modalbox-close" class="closeIcon">Close</a><div id="modalbox-content">Loading &hellip;</div><div><a class="normalButtonGrey" id="modalbox-close12" title="Cancel" href="#" style="position:absolute;background:none;float:right;right:115px;bottom:10px"> </a></div></div>');
			//$('body').append('<div id="modalbox-flyout"></div><div id="modalbox"><div id="modalbox-content">Loading &hellip;</div></div>');	
			
			// Get page sizes
			var arrPageSizes = ___getPageSize();
			
			$('#modalbox-flyout').css({
				backgroundColor:	settings.flyoutBgColor,
				opacity:			settings.flyoutOpacity,
				width:				arrPageSizes[0],
				height:				arrPageSizes[1]
			}).fadeIn();
			
			var arrModalBoxDim = __getModalboxDim();

			if(arrModalBoxDim){				
					settings.flyoutWidth = arrModalBoxDim[0];
					settings.flyoutHeight =	arrModalBoxDim[1];
			}
			$('#modalbox').css({
				marginTop:	"-" + ((settings.flyoutHeight)/2) + "px",
				marginLeft:	"-" + ((settings.flyoutWidth)/2) + "px",
				width:	settings.flyoutWidth+"px",
				height:	settings.flyoutHeight+"px"
			}).slideDown();
		
		
			if (jQuery.browser.msie && (ie55 || ie6)) {
				$('#modalbox-content').css({
					width:	settings.flyoutWidth-(0)+"px",
					height:	settings.flyoutHeight-(0)+"px",
					paddingRight: '30px'
				});
				}	else{
				$('#modalbox-content').css({
					width:	settings.flyoutWidth-(0)+"px",
					height:	settings.flyoutHeight-(0)+"px"
				});				
			}
			
			$('#modalbox-close').click(function() {				
				_close();
				return false;
			});
			$('#modalbox-close12').click(function() {				
				_close();
				return false;
			});			
		}
		
		function __getModalboxDim(){
			if(_dim!=""){_dim = _dim.split(",");return _dim}else{return false;}
		}
		
				
		function _close() {
			$('#modalbox').slideUp("fast",function(){$('#modalbox').remove();});			
			$('#modalbox-flyout').fadeOut("fast",function() { $('#modalbox-flyout').remove(); 	if (jQuery.browser.msie && (ie55 || ie6)) {$('embed, object, select').css({ 'visibility' : 'visible' });} });
		}
		
		function ___getPageSize() { //From LightBox
			var xScroll, yScroll;
			if (window.innerHeight && window.scrollMaxY) {	
				xScroll = window.innerWidth + window.scrollMaxX;
				yScroll = window.innerHeight + window.scrollMaxY;
			} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
				xScroll = document.body.scrollWidth;
				yScroll = document.body.scrollHeight;
			} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
				xScroll = document.body.offsetWidth;
				yScroll = document.body.offsetHeight;
			}
			var windowWidth, windowHeight;
			if (self.innerHeight) {	// all except Explorer
				if(document.documentElement.clientWidth){
					windowWidth = document.documentElement.clientWidth; 
				} else {
					windowWidth = self.innerWidth;
				}
				windowHeight = self.innerHeight;
			} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
				windowWidth = document.documentElement.clientWidth;
				windowHeight = document.documentElement.clientHeight;
			} else if (document.body) { // other Explorers
				windowWidth = document.body.clientWidth;
				windowHeight = document.body.clientHeight;
			}	
			// for small pages with total height less then height of the viewport
			if(yScroll < windowHeight){
				pageHeight = windowHeight;
			} else { 
				pageHeight = yScroll;
			}
			// for small pages with total width less then width of the viewport
			if(xScroll < windowWidth){	
				pageWidth = xScroll;		
			} else {
				pageWidth = windowWidth;
			}
			arrayPageSize = new Array(pageWidth,pageHeight,windowWidth,windowHeight);
			return arrayPageSize;
		}

			
		// Return the jQuery object for chaining. The unbind method is used to avoid click conflict when the plugin is called more than once
		//return this.unbind('click').click(_init);
		
};		
})(jQuery);