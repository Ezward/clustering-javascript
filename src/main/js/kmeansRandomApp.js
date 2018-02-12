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
    const kmeans = require("./kmeans/kmeans");
    const kmeanspp = require("./kmeans/kmeanspp");
    const randomCentroidInitializer = require("./kmeans/randomCentroidInitializer");
    const kmeansRandomModel = require("./kmeans/kmeansRandomModel");


    /**
     * @public
     * Load iris dataset and run kmeans on it given the number of clusters
     * 
     * @param {integer} k number of clusters to create
     */
    function cluster(k, n, d) {

        //
        // map iris data rows from dictionary to vector (array), leaving out the label
        //
        const observations = kmeansRandomModel.randomSphericalVectors(n, d, 10.0);

        //
        // create the intial model and run it
        //
        // const initialModel = randomCentroidInitializer(observations, k);
        const initialModel = kmeanspp(observations, k);

        //
        // cluster into given number of clusters
        //
        const results = kmeans.cluster(initialModel);
    
        //
        // do this for the convenience of the plotting functions
        //
        results.clusters = kmeans.assignmentsToClusters(results.model);

        return results;
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
        const centroids = model.centroids;
        const d = observations[0].length;
        const n = observations.length;
        const k = centroids.length;

        // 
        // put offset of each data points into clusters using the assignments
        //
        const clusters = results.clusters;

        //
        // plot the clusters
        //
        const chartData = {
            // for the purposes of plotting in 2 dimensions, we will use 
            // x = dimension 0 and y = dimension 1 
            datasets: clusters.map(function(c, i) { 
                return {
                    label: "cluster" + i,
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
                text: 'Random spherical data set (d=$d, n=$n) clustered using K-Means (k=$k)'
                        .replace("$d", d)
                        .replace('$n', n)
                        .replace('$k', k)
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

    return {'cluster': cluster, 'plot': plot};
});

