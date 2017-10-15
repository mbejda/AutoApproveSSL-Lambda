var page = new WebPage();

page.onConsoleMessage = function(msg) {
    console.log(msg);
};

page.onLoadStarted = function() {
    console.log("load started");
};

page.onLoadFinished = function() {
    console.log("load finished");
};




var system = require('system');
var args = system.args;

/// amazons approve url
var url = decodeURI(args[1]);


/// open amazons approve url and submit the form.
page.open(url, function(){
    window.setTimeout(function(){

    page.evaluate(function() {
        document.querySelectorAll("input[type='submit']")[0].click();

    });

    },500);


    window.setTimeout(function(){

        phantom.exit();
    },3000)

});

