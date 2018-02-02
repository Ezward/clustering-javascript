//
// uses requirejs modules
//
define(function () {
    "use strict";
    
    /**
     * Generate a random model for clustering
     * @param {Integer} k number of clusters (number of centroids) 
     * @param {Integer} n number of data points
     * @param {Integer} d dimension of data
     * @param {Number} min minimum value for data point
     * @param {Number} max maximum value for data point
     */
    com.lumpofcode.kmeans.randomModel = function(k, n, d, min, max) {
        "use strict";

        const range = max - min;

        // create n random observations, each of dimension d
        const observations = [];
        for(let i = 0; i < n; i += 1) {
            // create random observation of dimension d
            const observation = [];
            for(let j = 0; j < d; j += 1) {
                observation.push(min + Math.random() * range);
            }

            observations.push(observation);
        }

        return com.lumpofcode.kmeans.intializeModel(observations, k);
    }

});

