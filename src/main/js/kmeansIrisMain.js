//
// uses requirejs modules
//
define(function (require) {
    "use strict";

    //
    // cluster the iris dataset
    //
    require(["./kmeansIrisApp"], function(kmeansIrisApp) {
        const results = kmeansIrisApp.cluster(3);
        console.dir(results, {depth: null, colors: true})
    
        let showClusterColor = true;
        let showSpeciesColor = !showClusterColor;
        kmeansIrisApp.plot(document.querySelector("#container canvas"), results, showClusterColor, showSpeciesColor);
        kmeansIrisApp.plotIrisLabels(document.querySelector("#container2 canvas"));
        kmeansIrisApp.plotClusterComposition(document.querySelector("#container3 canvas"), results)    
    });
});