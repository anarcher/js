(function($) {                                          

var options = {};

$.fn.stop_imageflow = function() {
    return this.each(function() {
        stop(this);
    });
}

$.fn.start_imageflow = function() {
    return this.each(function() {
        start(this);
    });
}

$.fn.imageflow = function(o) {
    o = $.extend({
        btnPrev : null,
        btnNext : null,
        btnGo   : null,
        mousewheel : false,
        auto : null,
        speed : 200,
        vertical : false,
        circular : true,
        visible : 3,
        start : 0,
        scroll : 1,
        beforeStart : null,
        afterEnd : null,
    }, o || {});

    options = o;

    return this.each(function() {
        var running = false ;
        var animCss = o.vertical ? "top" : "left" ;
        var sizeCss = o.vertical ? "height" : "width" ;
        var div = $(this), ul = $("ul",div), tLi = $("li",ul), tl = tLi.size(), v = o.visible;

        if (o.circular) {
            ul.prepend(tLi.slice(tl-v-1+1).clone())
                .append(tLi.slice(0,v).clone());
            o.start += v; 
        }

        var li = $("li",ul), itemLength = li.size(), curr = o.start;
        this.curr = curr;

        li.css({ overflow : "hidden" , float : o.vertical ? "none" : "left" });
        ul.css({ margin : "0", padding : "0", position : "relative" , 
                    "list-style-type" : "none", "z-index" : "1" });
        div.css({ overflow : "hidden" , position : "relative" , "z-index" : "2", left: "0px" });

        var liSize = o.vertical ? height(li) : width(li);
        var ulSize = liSize * itemLength;
        var divSize = liSize * v;

        li.css({width : li.width() , height : li.height()});
        ul.css(sizeCss, ulSize+"px").css(animCss, - (curr * liSize));
        div.css(sizeCss, divSize+"px");

        if(o.btnPrev)
            $(o.btnPrev).click(function() {
                return go(curr-o.scroll);
            });

        if(o.btnNext)
            $(o.btnNext).click(function() {
                return go(curr+o.scroll);
            });

        if(o.btnGo)
            $.each(o.btnGo, function(i, val) {
                $(val).click(function() {
                    return go(o.circular ? o.visible+i : i);
                });
            });

        if(o.mouseWheel && div.mousewheel)
            div.mousewheel(function(e, d) {
                return d>0 ? go(curr-o.scroll) : go(curr+o.scroll);
            });

        if(o.auto)
            this.flowTimeout = setInterval(function() {
                go(curr+o.scroll);
            }, o.auto+o.speed);

        function vis() {
            return li.slice(curr).slice(0,v);
        };

        var go = function(to) {
            if(!running) {
                if(o.beforeStart) o.beforeStart.call(this,vis());
                if(o.circular) {
                    if(to<=o.start-v-1) {           // If first, then goto last
                        ul.css(animCss, -((itemLength-(v*2))*liSize)+"px");
                        // If "scroll" > 1, then the "to" might not be equal to the condition; it can be lesser depending on the number of elements.
                        curr = to==o.start-v-1 ? itemLength-(v*2)-1 : itemLength-(v*2)-o.scroll;
                    } else if(to>=itemLength-v+1) { // If last, then goto first
                        ul.css(animCss, -( (v) * liSize ) + "px" );
                        // If "scroll" > 1, then the "to" might not be equal to the condition; it can be greater depending on the number of elements.
                        curr = to==itemLength-v+1 ? v+1 : v+o.scroll;
                    } else curr = to;
                }
                else {
                    if(to<0 || to>itemLength-v) return;
                    else curr = to;
                }
                running = true;
                var half_visible = o.visible / 2;
                vis().each(function(i) {
                    var $tt = $(this);
                    if(i == 2) {
                        $('img',$tt).parent().css('z-index',100);
			            $('img',$tt).animate({ top: '-20px', left: '-20px', height: '104px', width: '104px' }, 1212);
                        /*
                        $tt.css({
                            height: '104px',
                            width:'102px'});
                        */
                    }
                    else {
                        $('img',$tt).animate({ top: 0, left: 0, height: '90px', width: '90px' }, 'fast', function() {
                            $('img',$tt).parent().css('z-index',1);
			            });
                        
                    }
                    /*
                    if(half_visible < i) {
                        var resize = 100 - ((i+1 - half_visible) * 20);
                        $("img",this).animate({ top : "-"+resize+"%",left: "-"+resize+"%", width: resize+"%", height : resize + "%" } , 500); 
                    }
                    else {
                        var resize = 100 - (half_visible-i) * 20 ;
                        $("img",this).animate({ top : "-"+resize+"%", left: "-"+resize+"%", width : resize+"%", height : resize + "%"} , 500);
                    }
                    */
                });

                ul.animate(
                    animCss == "left" ? { left: -(curr*liSize) } : { top: -(curr*liSize) } , o.speed, o.easing,
                    function() {
                        if(o.afterEnd)
                            o.afterEnd.call(this, vis());
                        running = false;
                    }
                );

                // Disable buttons when the carousel reaches the last/first, and enable when not
                if(!o.circular) {
                    $(o.btnPrev + "," + o.btnNext).removeClass("disabled");
                    $( (curr-o.scroll<0 && o.btnPrev)
                        ||
                       (curr+o.scroll > itemLength-v && o.btnNext)
                        ||
                       []
                     ).addClass("disabled");
                }
            }
            return false;
        };
        this.go = function(to) {
            go(curr + to);
        }
    });
};

function stop(obj) {
    if(obj.flowTimeout) {
        clearInterval(obj.flowTimeout);
    }
    else {
        alert('aa');
    }
}

function start(obj) {
    obj.flowTimeout = setInterval(function() {
        obj.go(options.scroll);
    }, options.auto + options.speed);
}

function css(el, prop) {
    return parseInt($.css(el[0], prop)) || 0;
};
function width(el) {
    return  el[0].offsetWidth + css(el, 'marginLeft') + css(el, 'marginRight');
};
function height(el) {
    return el[0].offsetHeight + css(el, 'marginTop') + css(el, 'marginBottom');
};

})(jQuery);
