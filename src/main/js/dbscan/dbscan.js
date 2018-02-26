/**
 * DBSCAN clustering module
 * 
 * cluster(observations, distance, epslilon, minimumPoints)
 */
define(function () {
    "use strict";

    const NOISE = -1;


    /**
     * Run DBSCAN clustering algorithm on the given observations and
     * return the resulting cluster assignments.
     * 
     * @param {[number]} list of observations 
     * @param {function} distance function the returns distance between two vectors
     * @param {number} epslilon maximum distance for point to be in neighborhood
     * @param {number} minimumPoints minimum number of points in neighborhood for a core point
     * @return {[number]} list of assignments with same length as the observations 
     */
    function dbscan(observations, distance, epslilon, minimumPoints) {
        const n = observations.length;
        const assignments = [];

        /**
         * find all neighbors of the given point (given index)
         * that are within epsilon distance 
         * 
         * @param {number} index index of observation
         * @return {number[]} list of neighboring observations indices
         */
        function rangeQuery(index) {
            const neighbors = [];
            for(let i = 0; i < n; i += 1) {
                if(i !== index) {
                    const d = distance(observations[index], observations[i]);
                    if(d <= epslilon) {
                        neighbors.push(i);
                    }
                }
            }
            return neighbors;
        }

        let clusterIndex = 0;

        for(let i = 0; i < n; i += 1) {
            //
            // if the point is not yet labeled as being
            // in a cluster or being noise, then we process it
            //
            if(undefined === assignments[i]) {
                const neighbors = rangeQuery(i);
                if(neighbors.length < minimumPoints) {
                    //
                    // this point is an outlier
                    //
                    assignments[i] = NOISE;
                } else {
                    //
                    // this point is a core point 
                    // and it's neighbors are part of it's cluster
                    //
                    assignments[i] = clusterIndex;
                    while(neighbors.length > 0) {
                        const neighbor = neighbors.shift();  // pop first element

                        //
                        // if it's an outliner, then add it to cluster
                        //
                        if(NOISE === assignments[neighbor]) {
                            assignments[neighbor] = clusterIndex;
                        }

                        //
                        // if the point is not yet been processed,
                        // then add to cluster and look at it's neighbors
                        //
                        if(undefined === assignments[neighbor]) {
                            assignments[neighbor] = clusterIndex;

                            //
                            // check each neighbor for it's neighbors
                            // and add them to the cluster if they are 
                            // not already in a cluster
                            //
                            const expansion = rangeQuery(neighbor);
                            for(let j = 0; j < expansion.length; j += 1) {
                                //
                                // shortcut - if it's noise, just add to cluster and 
                                // don't bother visiting it for expansion
                                //
                                if(NOISE === assignments[expansion[j]]) {
                                    assignments[expansion[j]] = clusterIndex;
                                }
                                if(undefined === assignments[expansion[j]]) {
                                    neighbors.push(expansion[j]);
                                }
                            }
                        }
                    }
                    
                    clusterIndex += 1;
                }
            }
        }

        return assignments;
    }

    /**
     * Use the model assignments to create
     * array of observation indices for each centroid
     * 
     * @param {object} model with observations and assignments
     * @return {*} result with clusers and outliers
     */
    function assignmentsToClusters(model) {
        // 
        // put offset of each data points into clusters using the assignments
        //
        const n = model.observations.length;
        const assignments = model.assignments;

        const outliers = [];
        const clusters = [];
        for(let i = 0; i < n; i += 1) {
            if(assignments[i] >= 0) {
                if(undefined == clusters[assignments[i]]) {
                    clusters[assignments[i]] = [];
                }
                clusters[assignments[i]].push(i);    
            } else {
                // it's an outlier
                outliers.push(i);
            }
        }
        return {'clusters': clusters, 'outliers': outliers};
    }


    return {
        'cluster': dbscan,
        "assignmentsToClusters": assignmentsToClusters
    };
});
