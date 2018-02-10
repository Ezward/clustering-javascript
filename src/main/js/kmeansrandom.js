//
// uses requirejs modules
//
define(function (require) {
    "use strict";

    //
    // cluster random data
    //
    require(["./clusterRandomData"], function(clusterRandomData) {
        const randomResults = clusterRandomData.cluster(5, 10000, 2);
        clusterRandomData.plot(document.querySelector("#container canvas"), randomResults);
    });
});