//
// uses requirejs modules
//
define(function (require) {
    "use strict";

    //
    // cluster random data
    //
    require(["./kmeansRandomApp"], function(kmeansRandomApp) {
        const randomResults = kmeansRandomApp.cluster(5, 10000, 2);
        kmeansRandomApp.plot(document.querySelector("#container canvas"), randomResults);
    });
});