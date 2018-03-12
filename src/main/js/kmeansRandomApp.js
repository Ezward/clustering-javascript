//
// uses requirejs modules
//

/**
 * Application to cluster random data using kmeans++
 * 
 * cluster(k, n, d) - cluster n data points of dimension d into k clusters
 * plot(canvas, result) - plot the results of cluster() to the given html5 canvas using clusterjs
 */
define(function (require) {
    "use strict";
    const euclidean = require("./distance/euclideanDistance");
    const kmeans = require("./kmeans/kmeans");
    const kmeanspp = require("./kmeans/kmeanspp");
    const randomCentroidInitializer = require("./kmeans/randomCentroidInitializer");
    const dbscan = require("./dbscan/dbscan");
    const randomModel = require("./dataset/randomData");

    function randomCenter(d, spread) {
        let centroid = [];
        for(let i = 0; i < d; i += 1) centroid.push(Math.random() * spread);
        return centroid;
    }

    /**
     * Generator n assignments to cluster k
     * 
     * @param {*} k 
     * @param {*} n 
     * @return {array} list of n integers with value k
     */
    function assign(k, n) {
        const assignments = [];
        for(let i = 0; i < n; i += 1) {
            assignments.push(k);
        }
        return assignments;
    }

    /**
     * Generate k clusters of n 2-dimensional points
     * with a circular distribution (a disk)
     * 
     * @param {number} k number of clusters
     * @param {number} n number of points in each cluster
     * @param {number} d dimension of observations and centroids
     * @param {number} r range of axes
     * @return {*} the initial model with observations, centroids, assignments and clusters
     */
    function randomSphericalClusters(k, n, d, r) {
        const centroids = [];
        const clusters = [];
        let observations = [];
        let assignments = [];
        for(let i = 0; i < k; i += 1) {
            //
            // generate observations, assignments and cluster center 
            //
            const centroid = randomCenter(d, r);
            const clusterObservations = randomModel.randomSphericalVectors(n, d, 1.0, centroid);
            const clusterAssignments = clusterObservations.map(o => i);    // generate assignment to this cluster for each observation
            centroids.push(centroid);
            clusters.push(clusterObservations);
            observations = observations.concat(clusterObservations);
            assignments = assignments.concat(clusterAssignments);
        }

        return {
            'observations': observations,
            'centroids': centroids,
            'assignments': assignments,
            'clusters': clusters
        };
    }

    /**
     *  Generate k clusters of n 2-dimensional points
     *  with a normal distribution.
     * 
     * @param {number} k number of clusters
     * @param {number} n number of points in each cluster
     * @param {number} d dimension of observations and centroids
     * @param {number} r range of axes
     * @return {*} the initial model with observations, centroids, assignments and clusters
     */
    function randomNormalClusters(k, n, d, r) {
        const centroids = [];
        const clusters = [];
        let observations = [];
        let assignments = [];
        for(let i = 0; i < k; i += 1) {
            //
            // generate observations, assignments and cluster center 
            //
            const centroid = randomCenter(d, r);
            const clusterObservations = randomModel.randomNormalVectors(n, d, centroid);
            const clusterAssignments = clusterObservations.map(o => i);    // generate assignment to this cluster for each observation
            centroids.push(centroid);
            clusters.push(clusterObservations);
            observations = observations.concat(clusterObservations);
            assignments = assignments.concat(clusterAssignments);
        }

        return {
            'observations': observations,
            'centroids': centroids,
            'assignments': assignments,
            'clusters': clusters
        };
    }

    /**
     *  Generate k clusters of n 2-dimensional points
     *  with a normal distribution.
     * 
     * @param {number} k number of clusters
     * @param {number} n number of points in each cluster
     * @param {number} d dimension of observations and centroids
     * @param {number} r range of axes
     * @return {*} the initial model with observations, centroids, assignments and clusters
     */
    function randomUniformClusters(k, n, d, r) {
        const centroids = [];
        const clusters = [];
        let observations = [];
        let assignments = [];
        for(let i = 0; i < k; i += 1) {
            //
            // generate observations, assignments and cluster center 
            //
            const centroid = randomCenter(d, r);
            const clusterObservations = randomModel.randomVectors(n, d, centroid);
            const clusterAssignments = clusterObservations.map(o => i);    // generate assignment to this cluster for each observation
            centroids.push(centroid);
            clusters.push(clusterObservations);
            observations = observations.concat(clusterObservations);
            assignments = assignments.concat(clusterAssignments);
        }

        return {
            'observations': observations,
            'centroids': centroids,
            'assignments': assignments,
            'clusters': clusters
        };
    }

    /**
     * Generate a random data model.
     * 
     * @param {number} k number of clusters to generate
     * @param {number} n number of points in each cluster
     * @param {number} d dimension of observations and centroids
     * @param {number} r range of axes
     * @param {string} dataType is "spherical" or "normal"
     */
    function generateRandomModel(k, n, d, r, dataType) {
        switch(dataType) {
            case "spherical": return randomSphericalClusters(k, n, d, r);
            case "normal": return randomNormalClusters(k, n, d, r);
            case "uniform": return randomUniformClusters(k, n, d, r);
        }
        throw Error("unexpected dataType in generateRandomModel()");
    }

    /**
     * @public
     * Load iris dataset and run DBSCAN on it on it using Euclidean distance
     * 
     * @param {array} observations, array of d-dimensional vectors
     * @param {number} epslilon maximum distance for point to be in neighborhood
     * @param {number} minimumPoints minimum number of points in neighborhood for a core point
     * @return {*} results with model (observations, assignments), clusters and clusterCompositions
     */
    function clusterWithDbscan(observations, epsilon, minimumPoints) {
        //
        // cluster, group the clusters, measure cluster composition
        //
        const results = dbscan.cluster(observations, euclidean.distance, epsilon, minimumPoints);
        const clusters = dbscan.assignmentsToClusters(results.model);
        results.model.centroids = [];   // no centroids in dbscan

        return {
            'model': results.model,
            'clusters': clusters.clusters,
            'outliers': clusters.outliers,
            'iterations': results.iterations,
            'durationMs': results.durationMs
        };
    }



    /**
     * @public
     * 
     * @param {array} observations, array of d-dimensional vectors
     * @param {number} k number of clusters to generate
     * @param {string} algorithm is "kmeans", "kmeans++"
     * @return {*} results with model (observations, assignments), clusters and clusterCompositions
     */
    function clusterWithKmeans(observations, k, initializer) {
        //
        // cluster, group the clusters, measure cluster composition
        //
        const initialClusters = initializer(observations, k);;
        const results = kmeans.cluster(observations, initialClusters);
        const clusters = kmeans.assignmentsToClusters(results.model);

        //
        // fixup model parameters
        //
        results.model.parameters.algorithm = (initializer === kmeanspp) ? 'kmeans++' : 'kmeans';

        return {
            'model': results.model,
            'clusters': clusters,
            'outliers': [],                  // no outliers in kmeans
            'iterations': results.iterations,
            'durationMs': results.durationMs
        };
    }

    /**
     * Cluster the observations given the algorithm and parameters
     * and return the resulting model.
     * 
     * @param {*} observations 
     * @param {*} k 
     * @param {*} epsilon 
     * @param {*} minimumPoints 
     * @param {*} algorithm 
     * @return {*} results iterations, durationMs and model with observations, centroids, assignments, clusters, 
     */
    function cluster(observations, k, epsilon, minimumPoints, algorithm) {
        switch(algorithm) {
            case 'kmeans': return clusterWithKmeans(observations, k, randomCentroidInitializer);
            case 'kmeans++': return clusterWithKmeans(observations, k, kmeanspp);
            case 'dbscan': return clusterWithDbscan(observations, epsilon, minimumPoints);
        }
        throw new Error("unexpected algorithm in cluster()");
    }

    const clusterColor = ['red', 'green', 'blue', 'yellow', 'purple', 'cyan', 'magenta', 'pink', 'brown', 'black'];
    let chart = undefined;

    /**
     * plot the clustred iris data model.
     * 
     * @param {object} results of cluster(), with model, clusters and clusterCompositions
     * @param {boolean} showClusterColor true to show learned cluster points
     * @param {boolean} showSpeciesColor true to show known dataset labelled points
     */
    function plot(canvas, results) {

        //
        // map iris data rows from dictionary to vector (array), leaving out the label
        //
        const model = results.model;
        const observations = model.observations;
        const assignments = model.assignments;
        const centroids = model.centroids || [];    // dbscan does not produce centroids
        const outliers = results.outliers || [];    // kmeans does not produce outliers
        const d = observations[0].length;
        const n = observations.length;

        // 
        // add the outliers as the last cluster
        //
        const hasOutliers = outliers.length > 0;
        const clusters = [];
        results.clusters.forEach(c => clusters.push(c));
        if(hasOutliers) {
            clusters.push(outliers);
        }
        const k = clusters.length;

        const algorithm = model.parameters.algorithm;
        const parameters = model.parameters;
        let algorithmLabel = algorithm + 
                ((algorithm === 'dbscan') 
                ? " (ε=$e, m=$m)".replace("$e", parameters.e).replace("$m", parameters.m) 
                : " (k=$k)".replace("$k", parameters.k));
        //
        // plot the clusters
        //
        const chartData = {
            // for the purposes of plotting in 2 dimensions, we will use 
            // x = dimension 0 and y = dimension 1 
            datasets: clusters.map(function(c, i) { 
                return {
                    label: (hasOutliers && (i === k-1)) ? "outliers" : ("cluster" + i),
                    data: c.map(d => ({'x': observations[d][0], 'y': observations[d][1]})),
                    backgroundColor: clusterColor[i % clusterColor.length],
                    pointBackgroundColor: clusterColor[i % clusterColor.length],
                    pointBorderColor:  clusterColor[i % clusterColor.length]
                };
            })
        };
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Random data set (d=$d, n=$n) clustered using ' 
                        .replace("$d", d)
                        .replace('$n', n)
                        + algorithmLabel
            },
            legend: {
                position: 'bottom',
                display: true
            },
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    scaleLabel: {
                        labelString: 'x axis',
                        display: false,
                    }
                }],
                yAxes: [{
                    type: 'linear',
                    position: 'left',
                    scaleLabel: {
                        labelString: 'y axis',
                        display: false
                    }
                }]
            }
        };

        //
        // we need to destroy the previous chart so it's interactivity 
        // does not continue to run
        //
        if(undefined !== chart) {
            chart.destroy()
        } 
        chart = new Chart(canvas, {
            type: 'scatter',
            data: chartData,
            options: chartOptions,
        });

    }


    let labelsChart = undefined;

    /**
     * plot the clustred iris data model.
     * 
     * @param {object} results of generate(), with model, clusters and clusterCompositions
     * @param {boolean} showClusterColor true to show learned cluster points
     * @param {boolean} showSpeciesColor true to show known dataset labelled points
     */
    function plotGeneratedLabels(canvas, data, generator) {

        //
        // map iris data rows from dictionary to vector (array), leaving out the label
        //
        const observations = data.observations;
        const assignments = data.assignments;
        const centroids = data.centroids || [];    // dbscan does not produce centroids
        const outliers = data.outliers || [];    // kmeans does not produce outliers
        const d = observations[0].length;
        const n = observations.length;

        // 
        // add the outliers as the last cluster
        //
        const hasOutliers = outliers.length > 0;
        const clusters = [];
        data.clusters.forEach(c => clusters.push(c));
        if(hasOutliers) {
            clusters.push(outliers);
        }
        const k = clusters.length;


        //
        // plot the clusters
        //
        const chartData = {
            // for the purposes of plotting in 2 dimensions, we will use 
            // x = dimension 0 and y = dimension 1 
            datasets: clusters.map(function(c, i) { 
                return {
                    label: (hasOutliers && (i === k-1)) ? "outliers" : ("cluster " + String.fromCharCode(i + 65)),
                    data: c.map(d => ({'x': d[0], 'y': d[1]})),
                    backgroundColor: clusterColor[i % clusterColor.length],
                    pointBackgroundColor: clusterColor[i % clusterColor.length],
                    pointBorderColor:  clusterColor[i % clusterColor.length]
                };
            })
        };
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Random $generator data set labels (k=$k, n=$n, d=$d)'
                        .replace("$d", d)
                        .replace('$n', n)
                        .replace('$k', k)
                        .replace('$generator', generator)
            },
            legend: {
                position: 'bottom',
                display: true
            },
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    scaleLabel: {
                        labelString: 'x axis',
                        display: false,
                    }
                }],
                yAxes: [{
                    type: 'linear',
                    position: 'left',
                    scaleLabel: {
                        labelString: 'y axis',
                        display: false
                    }
                }]
            }
        };

        //
        // we need to destroy the previous chart so it's interactivity 
        // does not continue to run
        //
        if(undefined !== labelsChart) {
            labelsChart.destroy()
        } 
        labelsChart = new Chart(canvas, {
            type: 'scatter',
            data: chartData,
            options: chartOptions,
        });

    }



    return {'generate': generateRandomModel, 'cluster': cluster, 'plot': plot, 'plotLabels': plotGeneratedLabels};
});

