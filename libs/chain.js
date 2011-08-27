/**
 * Executes all functions (passed as arguments) in order.
 * http://dracoblue.net/dev/chain-group-callbacks-for-nodejs/160/
 * 
 * 
 Example:

var stats = null;
chain(function(cb) {
    posix.rename("/tmp/hello", "/tmp/world").addCallback(function () {
        cb();
    });
}, function(cb) {
    posix.stat("/etc/passwd").addCallback(function (chain_stats) {
        stats = chain_stats;
        cb();
    });
}, function() {
    sys.puts("stats: " + JSON.stringify(stats));
});
 
 * @return
 */
var Chain = module.exports = function Chain () {
    var args = arguments;
    var args_length = args.length;
    
    if (args_length === 0) {
        return ;
    }
    
    var args_pos = 0;
    var start_func = function() {
        args[args_pos](function() {
            args_pos++;
            if (args_length > args_pos) {
                start_func();
            }
        });
    };
    
    start_func();
}