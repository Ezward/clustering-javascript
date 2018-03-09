//
// uses requirejs modules
//
define(function (require) {
    "use strict";

    const kmeansRandomApp = require("./kmeansRandomApp");

    let randomDataModel = undefined;
    let clusteredDataModel = undefined; 

    function generateData() {
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
        randomDataModel = kmeansRandomApp.generate(kData, n, d, generator);
        clusterData();
    }

    //
    // cluster random data
    //
    function clusterData() {
        if(undefined != randomDataModel) {
            //
            // get clustering values from controls
            //
            const k = parseInt(document.querySelector(".controls input[name=kEdit]").value);
            const e = parseFloat(document.querySelector(".controls input[name=eEdit]").value);
            const m = parseInt(document.querySelector(".controls input[name=mEdit]").value);
            const algorithm = document.querySelector("#select_algorithm").value;

            //
            // cluster the data set with the requested algorithm
            //
            clusteredDataModel = kmeansRandomApp.cluster(randomDataModel.observations, k, e, m, algorithm);

            //
            // plot the results of clustering the randome data
            //
            kmeansRandomApp.plot(document.querySelector("#container canvas"), clusteredDataModel);
        }
    }

    return {'generateData': generateData, 'clusterData': clusterData};
});