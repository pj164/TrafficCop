
var inProgress = {};

$.trafficCop = function(url, options) {
    var reqOptions, key;
    if(arguments.length === 2) {
        reqOptions = $.extend({}, options, { url: url });
    }
    else {
        reqOptions = url;
    }
    key = JSON.stringify(reqOptions);
    if(inProgress[key]) {
        inProgress[key].successCallbacks.push(reqOptions.success);
        inProgress[key].errorCallbacks.push(reqOptions.error);
        return;
    }

    var remove = function() {
            delete inProgress[key];
        },
        traffic = {
            successCallbacks: [reqOptions.success],
            errorCallbacks: [reqOptions.error],
            success: function(response) {
                $.each($(inProgress[key].successCallbacks), function(idx,item){ item(response); });
                remove();
            },
            error: function(exception) {
                $.each($(inProgress[key].errorCallbacks), function(idx,item){ item(exception); });
                remove();
            }
        };
    inProgress[key] = $.extend({}, reqOptions, traffic);
    $.ajax(inProgress[key]);
};

