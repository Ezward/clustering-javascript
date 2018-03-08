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
        // get clustering values from controls
        //
        const k = parseInt(document.querySelector(".controls input[name=kEdit]").value);
        const e = parseFloat(document.querySelector(".controls input[name=eEdit]").value);
        const m = parseInt(document.querySelector(".controls input[name=mEdit]").value);
        const algorithm = document.querySelector("#select_algorithm").value;

        //
        // get data generation values from controls
        //
        const kData = parseInt(document.querySelector(".controls input[name=kDataEdit]").value);
        const n = parseInt(document.querySelector(".controls input[name=nDataEdit]").value);
        const d = parseInt(document.querySelector(".controls input[name=dDataEdit]").value);
        const generator = document.querySelector("#select_generator").value;

        //
        // generate the random data set
        //
        const randomData = kmeansRandomApp.generate(kData, n, d, generator);

        //
        // cluster the data set with the requested algorithm
        //
        const randomResults = kmeansRandomApp.cluster(randomData.observations, k, e, m, algorithm);

        //
        // plot the results
        //
        kmeansRandomApp.plot(document.querySelector("#container canvas"), randomResults);
    });
});