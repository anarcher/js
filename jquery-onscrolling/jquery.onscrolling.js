(function($) {
    $.fn.onscrolling = function(options) {
        var opts = $.extend({},$.fn.onscrolling.defaults,options);
        return this.each(function() {
            var $this = $(this);
            var o = $.meta ? $.extend({},opts, $this.data()) : opts;
            var onscroll = o.onscroll;
            $this.bind("scroll",function() {
                var total  = $this[0].scrollHeight - $this[0].clientHeight;
                var percent = parseInt($this[0].scrollTop / total * 100 , 10);
                var isScrollEnded = $this[0].scrollHeight - $this[0].clientHeight - $this[0].scrollTop <= 0 ? true : false; 
                onscroll(percent,isScrollEnded);
            });
        });
    }

    $.fn.onscrolling.defaults = {
        onscroll : function() {}
    }

})(jQuery);
