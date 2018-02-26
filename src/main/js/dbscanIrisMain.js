//
// uses requirejs modules
//
define(function (require) {
    "use strict";

    //
    // cluster the iris dataset
    //
    require(["./dbscanIrisApp"], function(clusterIrisApp) {

        const epsilon = document.querySelector(".controls input[name=epsilonEdit]").value;
        const minimumPoints = document.querySelector(".controls input[name=minimumPointsEdit]").value;

        const results = clusterIrisApp.cluster(epsilon, minimumPoints);
        console.dir(results, {depth: null, colors: true})
    
        let showClusterColor = true;
        let showSpeciesColor = !showClusterColor;
        clusterIrisApp.plot(document.querySelector("#container canvas"), results, showClusterColor, showSpeciesColor);
        clusterIrisApp.plotIrisLabels(document.querySelector("#container2 canvas"));
        clusterIrisApp.plotClusterComposition(document.querySelector("#container3 canvas"), results)    
    });
});