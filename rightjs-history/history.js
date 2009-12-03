
function setScope(callback, scope) {
    return function() {
        return callback.apply(scope, arguments);
    };
};

var History = new Class({
    extend: {
        Version: '0.1',
    },
    include: Options,
    Options: {
        binding: null,
        defaultHash: ''
    },
    initialize: function(options) {
        this.setOptions(options);
        var hash = (top.location.hash == '' || top.location.hash == '#')  ? this.options.defaultHash : top.location.hash;
        if (Browser.IE) { 
            document.write('<iframe id="msieframe" style="display: none;"></iframe>');
            this.iframe = $("msieframe").contentWindow.document;
            this.iframe.open();
            this.iframe.close();
            this.iframe.location.hash = top.location.hash;
            this.hash = this.iframe.location.hash;
        }
        else {
            this.hash = hash;
        }
        this.change(hash);
        this.intervalId = setInterval(setScope(this.checkHash,this), 200);
    },
    setLocation: function(hash) {
        top.location.hash = hash;
        this.hash = top.location.hash;
        if (Browser.IE) {
            this.iframe.open();
            this.iframe.close();
            this.iframe.location.hash = this.hash;
        }
        this.change(hash);
    },
    checkHash: function() {
        if (Browser.IE) {
            var f = $("msieframe");
            var iframe = f.contentDocument || f.contentWindow.document;
            if (this.hash != iframe.location.hash ) {
                this.hash  = iframe.location.hash;
                this.hash  = ( this.hash == '#' ) ? '' : this.options.defaultHash;
                top.location.hash = this.hash;
                var hash = this.hash ? this.hash : this.options.defaultHash;
                this.change(hash);
            }
            return;
        }
        if(this.hash != top.location.hash) {
            this.hash = top.location.hash;
            var hash = this.hash ? this.hash : this.options.defaultHash;
            this.change(hash);
        }
    },
    /* private methods */
    change: function(hash) {
        if (this.options.binding) {
            if(isArray(this.options.binding)) {
                for(i = 0; i < this.options.binding.length; i++) {
                    this.options.binding[i].fire('change',hash);
                }
            }
            else { 
                this.options.binding.fire('change',hash);
            }
        }
    }
});

