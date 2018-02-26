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

        /**
         * Given a cluster and a point in the cluster,
         * if the point is a core point (has >= min neighbors)
         * then add any neighbors of that core point to 
         * the cluster, unless they are already in a cluster.
         * 
         * @param {*} clusterIndex zero based index of cluster 
         * @param {*} index index of point in observations that is part of cluster
         * @param {*} clusterPoints are the points in the cluster 
         */
        function expandCluster(clusterIndex, index, clusterPoints) {
            //
            // find neighbors of this point
            //
            const neighbors = rangeQuery(index);
            const neighborCount = neighbors.length;
            if(neighborCount >= minimumPoints) {
                //
                // this point is a core point.
                // add any of it's neighbors to the cluster
                // if they are not already in a cluster
                //
                for(let i = 0; i < neighborCount; i += 1) {
                    //
                    // if the neighbor is not yet classified, then add it to the cluster.
                    // if the neighbor was an outlier, then assign it to the cluster
                    //
                    const observationIndex = neighbors[i];
                    switch(assignments[observationIndex]) {
                        case undefined: clusterPoints.push(observationIndex);            // fall through, so it is assignmentsled to this cluster
                        case NOISE: assignments[observationIndex] = clusterIndex; break; // outlier is now part of this cluster
                    }

                }
            }
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
                    for(let j = 0; j < neighbors.length; j += 1) {
                        assignments[neighbors[j]] = clusterIndex;
                    }

                    //
                    // check each neighbor for it's neighbors
                    // and add them to the cluster if they are 
                    // not already in a cluster
                    //
                    for(let j = 0; j < neighbors.length; j += 1) {
                        expandCluster(clusterIndex, neighbors[j], neighbors);
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
