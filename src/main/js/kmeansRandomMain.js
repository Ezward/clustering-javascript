//
// uses requirejs modules
//
define(function (require) {
    "use strict";

    //
    // cluster random data
    //
    require(["./kmeansRandomApp"], function(kmeansRandomApp) {
        //
        // get values from controls
        //
        const k = document.querySelector(".controls input[name=kEdit]").value;
        const n = document.querySelector(".controls input[name=nEdit]").value;
        const d = document.querySelector(".controls input[name=dEdit]").value;
        const randomResults = kmeansRandomApp.cluster(k, n, d);
        kmeansRandomApp.plot(document.querySelector("#container canvas"), randomResults);
    });
});