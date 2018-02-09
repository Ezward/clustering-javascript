//
// uses requirejs modules
//
define(function (require) {
    "use strict";

    //
    // cluster the iris dataset
    //
    require(["./clusterIrisData"], function(clusterIrisData) {
        const results = clusterIrisData.cluster(3);
        console.dir(results, {depth: null, colors: true})
    
        let showClusterColor = true;
        let showSpeciesColor = !showClusterColor;
        clusterIrisData.plot(document.querySelector("#container canvas"), results, showClusterColor, showSpeciesColor);
        clusterIrisData.plotIrisLabels(document.querySelector("#container2 canvas"));
        clusterIrisData.plotClusterComposition(document.querySelector("#container3 canvas"), results)    
    });

    //
    // cluster random data
    //
    require(["./clusterRandomData"], function(clusterRandomData) {
        const randomResults = clusterRandomData.cluster(5, 10000, 2);
        clusterRandomData.plot(document.querySelector("#container4 canvas"), randomResults);
    });
});