/**
 * Creates a group of all passed arguments (each of them must be a function)
 * and returns a function, which executes all.
 * http://dracoblue.net/dev/chain-group-callbacks-for-nodejs/160/
 * Example
 
var stats = null;
Group(function(cb) {
    posix.rename("/tmp/hello", "/tmp/world").addCallback(function () {
        cb();
    });
}, function(cb) {
    posix.stat("/etc/passwd").addCallback(function (chain_stats) {
        stats = chain_stats;
        cb();
    });
})(function() {
    sys.puts("stats: " + JSON.stringify(stats));
})
 
 
 * @return function
 */
var Group = exports = module.exports = function Group () {
    var args = arguments;
    var args_length = args.length;
    
    return function(cb) {
        if (args_length === 0) {
            cb();
            return ;
        } 
     
        var items_left_to_execute = args_length;
        
        var call_group_item = function(arg) {
            arg(function() {
                items_left_to_execute--;
                if (!items_left_to_execute) {
                    cb();
                }
            });
        };
    
        for ( var i = 0; i < args_length; i++) {
            call_group_item(args[i]);
        }
    };
}
