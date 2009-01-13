(function($) {
    $.fn.scrollable = function(options) {
        var opts = $.extend({},$.fn.scrollable.defaults,options);
        return this.each(function() {
            $this = $(this);
            $this.scrollTop(0);
            var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
            $track = $(o.track);
            $track_handle = $(o.track_handle);
            $track.slider({
                axis: 'vertical', 
                animate: o.animate,
                startValue:0,
                handle: o.track_handle,
                slide: onScrollSlide,
                change: onScrollChange,
                stop : o.stop_scroll
            });
            recalculate($this,$track,$track_handle,o.track_handle_height);

            $.fn.scrollable.recalculate = function() {
                recalculate($this,$track,$track_handle,o.track_handle_height);
            }

            $this.bind(
                'mousewheel',onMousewheel
            );
            $track.bind(
                'mousewheel',onMousewheel
            );

            function onMousewheel(event,delta) {
                var offsetHeight = $this.attr("offsetHeight");
                var scrollHeight = $this.attr("scrollHeight");
                if(offsetHeight >= scrollHeight) { return true; }

                var pos = Math.abs(parseInt(-(delta / 10 ) * 100,10));
                if(delta > 0) {
                    $track.slider("moveTo","-="+pos);
                }
                else {
                    $track.slider("moveTo","+="+pos);
                }
                if(offsetHeight > scrollHeight) { return true; }
                return false;
            }

            function onScrollSlide(e,ui) {
                var max_scroll = $this.attr("scrollHeight") - $this.height();
                var pos = ui.value * ( max_scroll / 100);
                o.before_change(e,ui);
                $this.scrollTop(pos);
                o.after_change(e,ui);
            }
            function onScrollChange(e,ui) {
                var max_scroll = $this.attr("scrollHeight") - $this.height();
                var pos = ui.value * ( max_scroll / 100);
                o.before_change(e,ui);
                if(o.animate) {
                    $this.animate({scrollTop: pos }, 300);
                }
                else {
                    $this.scrollTop(pos);
                }
                o.after_change(e,ui);
            }
        });
    }

    

    function recalculate(scrollable,track,track_handle,min_track_height) {
        if(scrollable.attr("offsetHeight") >= scrollable.attr("scrollHeight")) {
            track.hide();
            track_handle.hide();
            return ;
        }
        if(track.css("display") != 'block') {
            track.show();
            track_handle.show();
        }
        var handle_height = Math.max(scrollable.attr("offsetHeight") * 
        ( scrollable.attr("offsetHeight") / scrollable.attr("scrollHeight") ),min_track_height);
        handle_height = Math.min(handle_height,track.attr("offsetHeight"));
        track_handle.css("height",parseInt(handle_height,10)+"px");
        
    }

    $.fn.scrollable.defaults = {
        animate : false,
        track : '#scrollbar_track',
        track_handle : '#scrollbar_handle',
        track_handle_height : 44,
        before_change : function() {},
        after_change : function() {},
        stop_scroll : function() {}
    }
})(jQuery);
