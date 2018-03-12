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
        const r = parseInt(document.querySelector(".controls input[name=rDataEdit]").value);
        const generator = document.querySelector("#select_generator").value;

        //
        // generate the random data set
        //
        randomDataModel = kmeansRandomApp.generate(kData, n, d, r, generator);

        //
        // plot the generated labels
        //
        kmeansRandomApp.plotLabels(document.querySelector("#container2 canvas"), randomDataModel, generator);

        //
        // cluster the generated data using the current settings
        //
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

    /**
     * show the plot (it has already been generated)
     * @param {*} container 
     */
    function plotData(container) {
        document.querySelectorAll('.container').forEach(e => e.classList.add('hidden'));
        document.getElementById(container).classList.remove('hidden');
    }


    return {'generateData': generateData, 'clusterData': clusterData, 'plotData': plotData};
});