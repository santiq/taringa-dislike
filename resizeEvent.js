//onResize Event for jQuery

//by FabiStark with ♥

//Easy way to use

/*
	$('p').onResize(optional callback(obj){
		//do something, you can't handle event

		//obj = {jQuery Object, width, height}
	});

	OR
	$('p').onResize().on('resize',function(event){
		//You can handle this event
	});
	
	Note: 'resize' event launchs first.
	
*/

$.fn.onResize = function(callback){
	return this.each(function() {
		var $this = $(this);
		var lastW=$this.width();
		var lastH=$this.height();
		var W=$this.width();
		var H=$this.height();
        var Intervaler = setInterval(function() {
        	if(W!=lastW || H!=lastH){
        		setTimeout(function(){$this.trigger("resize");},200); //jQuery event
        		W=$this.width();
				H=$this.height();
        		
        	}
        	lastW = $this.width();
        	lastH = $this.height();
        },100);
    });
}