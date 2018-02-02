
//
// uses requirejs modules
//
define(function () {
    "use strict";

    /**
     * @public
     * create an initial model given the data and the number of clusters.
     * This chooses k random observations as centroids and
     * assigns all points evenly across the centroids.
     * 
     * @param {[float]} observations the data as an array of number
     * @param {integer} k the number of clusters
     */
    return function(observations, k) {

        //
        // choose k random centers from list of observations
        //
        const n = observations.length;
        const randomIndices = [];
        for(let i = 0; i < n; i += 1) {
            randomIndices.push(i);
        }
        const centroids = [];
        for(let i = 0; i < k; i += 1) {
            const j = Math.floor(Math.random() * randomIndices.length);
            centroids.push(observations[randomIndices[j]]);
            randomIndices.splice(j, 1); // remove this index from consideration;
        }

        //
        // initiallly assign all observations to the first cluster
        //
        const assignments = []
        for(let i = 0; i < n; i += 1) {
            assignments.push(i % k);
        }

        return {'observations': observations, 'centroids': centroids, 'assignments': assignments}
    }

});

