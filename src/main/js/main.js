//
// uses requirejs modules
//
define(function (require) {
    "use strict";

    const clusterIrisData = require("./clusterIrisData");
    const results = clusterIrisData.cluster(3);

    console.dir(results, {depth: null, colors: true})

    let showClusterColor = true;
    let showSpeciesColor = !showClusterColor;

    clusterIrisData.plot(results.model, showClusterColor, showSpeciesColor);
});