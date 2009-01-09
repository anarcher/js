(function($) {
    $.fn.scrollable = function(options) {
        var opts = $.extend({},$.fn.scrollable.defaults,options);
        return this.each(function() {
            $this = $(this);
            var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
            $track = $(o.track);
            $track.slider({
                axis: 'vertical', 
                animate: o.animate,
                handle: o.track_handle,
                slide: onScrollSlide,
                change: onScrollChange
            });
            $track_handle = $(o.track_handle);

            $this.scrollTop(0);
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
                var pos = Math.abs(parseInt(-(delta / 20 ) * 100,10));
                if(delta > 0) {
                    $track.slider("moveTo","-="+pos);
                }
                else {
                    $track.slider("moveTo","+="+pos);
                }
                if($this.attr("offsetHeight") > $this.attr("scrollHeight")) { 
                    return true;
                }
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
        if(scrollable.attr("offsetHeight") > scrollable.attr("scrollHeight")) {
            track.hide();
            return ;
        }
        if(track.css("display") != 'block') {
            track.show();
        }
        var handle_height = Math.max(scrollable.attr("offsetHeight") * 
        ( scrollable.attr("offsetHeight") / scrollable.attr("scrollHeight") ),min_track_height);
        handle_height = Math.min(handle_height,track.attr("offsetHeight"));
        track_handle.css("height",parseInt(handle_height,10)+"px");
    }

    $.fn.scrollable.defaults = {
        animate : true,
        track : '#scrollbar_track',
        track_handle : '#scrollbar_handle',
        track_handle_height : 20,
        before_change : function() {},
        after_change : function() {}
    }
})(jQuery);
