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
            'clusters': clusters,
            'generator': {
                'generator': "uniform",
                'k': k,
                'n': n,
                'd': d,
                'r': r
            }
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
            'clusters': clusters,
            'generator': {
                'generator': "uniform",
                'k': k,
                'n': n,
                'd': d,
                'r': r
            }
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
            'clusters': clusters,
            'generator': {
                'generator': "uniform",
                'k': k,
                'n': n,
                'd': d,
                'r': r
            }
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

    //
    // return label for generated cluster
    //
    function syntheticLabel(i) {
        return "Cluster " + String.fromCharCode(i + 65);
    }



    /**
     * @private
     * using the data labels from the randomly generated data, 
     * calculate the proportion of each generated cluster
     * in the calculated clusters.  
     *
     * So if 1/4 of the Cluster A data points
     * are in cluster0, then report 25% Cluster A.
     * Note that a cluster will have as many labels as generated clusters
     * and they may not add up to 100% for that cluster, but 
     * each generated cluster will add up to 100% over all calculated clusters.
     * 
     * @param {clusters} array of observation indicies (generated data row) for each cluster
     * @return map of species to percent for each cluster (centroid)
     */
    function measureClusterCompositions(data, clusters, outliers) {

        /**
         * count each type of generated cluster in the given calculated cluster.
         * 
         * @param {*} cluster 
         * @return {*} object with cluster count for each generated type
         */
        function computeClusterCounts(data, cluster) {
            // initialize each generated cluster count to zero, then count all assignments
            const counts = data.clusters.map(c => 0); 
            cluster.forEach(observationIndex => counts[data.assignments[observationIndex]] += 1 );

            // map counts to the names of the generated clusters
            const composition = {};
            data.clusters.forEach((c, i) => composition["Cluster " + String.fromCharCode(i + 65)] = counts[i]);
            return composition;
        }

        /**
         * Use count of each generated type to compute the percetage composition in the cluster.
         * @param {*} clusterComposition 
         */
        function mapClusterCountToPercentage(clusterComposition) {

            const percentageComposition = {};
            syntheticLabels.forEach((n, i) => 
                percentageComposition[n] =  {
                    'count': clusterComposition[n], 
                    'percent': clusterComposition[n] / generatedCounts[n]
                });
            return percentageComposition;
        }

        //
        // names of generated clusters
        //
        const syntheticLabels = data.clusters.map((c, i) => syntheticLabel(i));

        //
        // count total number of each generated cluster using labels given in the dataset
        //
        const generatedCounts = {};
        data.clusters.forEach((c, i) => generatedCounts[syntheticLabels[i]] = c.length);

        //
        // count how many of each species in each cluster
        //
        const clusterCounts = clusters.map(c => computeClusterCounts(data, c));
        const outlierCounts = computeClusterCounts(data, outliers);

        //
        // turn counts into percentages
        //
        const clusterPercentages = clusterCounts.map(clusterCount => mapClusterCountToPercentage(clusterCount));
        const outlierPercentages = mapClusterCountToPercentage(outlierCounts);

        return {
            "clusterCompositions": clusterPercentages, 
            "outlierComposition": outlierPercentages
        };
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

        //
        // add centroids to datasets
        //
        if(centroids && centroids.length > 0) {
            chartData.datasets.unshift({
                label: "Centroids",
                data: centroids.map(d => ({'x': d[0], 'y': d[1]})),
                pointRadius: 5,
                fill: false,
                pointBorderColor: 'black'
            });
        }

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Random data set (k=$k, d=$d, n=$n) clusters learned using ' 
                        .replace("$k", k)
                        .replace('$n', n)
                        .replace("$d", d)
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
    function plotGeneratedLabels(canvas, data) {

        //
        // map  data rows from dictionary to vector (array), leaving out the label
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

        //
        // add centroids to datasets
        //
        if(data.centroids && data.centroids.length > 0) {
            chartData.datasets.unshift({
                label: "Centroids",
                data: data.centroids.map(d => ({'x': d[0], 'y': d[1]})),
                pointRadius: 5,
                fill: false,
                pointBorderColor: 'black'
            });    
        }

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'random $generator data set labels (k=$k, n=$n, d=$d)'
                        .replace("$d", d)
                        .replace('$n', n)
                        .replace('$k', k)
                        .replace('$generator', data.generator.generator)
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

    let compositionChart = undefined;

    /**
     * Plot the composition of the calculated clusters with respect to
     * the true labels.
     * 
     * @param {*} canvas 
     * @param {*} data 
     * @param {*} results 
     */
    function plotClusterComposition(canvas, data, results) {

        //
        // names of generated clusters
        //
        const syntheticLabels = data.clusters.map((c, i) => syntheticLabel(i));

        //
        // calculate the clusters' composition and outlier compositions
        //
        const resultsComposition = measureClusterCompositions(data, results.clusters, results.outliers);
        const clusterCompositions = [];
        resultsComposition.clusterCompositions.forEach(cc => clusterCompositions.push(cc));
        clusterCompositions.push(resultsComposition.outlierComposition);

        const k = clusterCompositions.length;

        const generator = data.generator;
        const generatorLabel = 'Random $generator data set (k=$k, n=$n, d=$d)'
        .replace("$d", generator.d)
        .replace('$n', generator.n)
        .replace('$k', generator.k)
        .replace('$generator', generator.generator)


        const datasets = syntheticLabels.map((sp, i) => ({
                label: sp,
                data: clusterCompositions.map(cc => cc[sp].percent),
                backgroundColor: clusterColor[i % clusterColor.length]
        }));

        const chartConfig = {
            type: 'bar',
            data: {
                labels: clusterCompositions.map((cc, i) => (i == k-1) ? "outliers" : ("cluster" + i)),
                datasets: datasets,    
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: "Learned cluster composition (k=$k) for $dataset".replace("$k", k-1).replace("$dataset", generatorLabel)
                },
                legend: {
                    position: 'bottom',
                    display: true
                },
                tooltips: {
                    callbacks: {
                        label: (tooltipItem, data) => syntheticLabels[tooltipItem.datasetIndex] + ": " + Math.floor(clusterCompositions[tooltipItem.index][syntheticLabels[tooltipItem.datasetIndex]].percent * 1000) / 10 + "%",
                        labelColor: (tooltipItem, data) => ({'backgroundColor': clusterColor[tooltipItem.datasetIndex]})
                    }
                }
            }
        };

        //
        // remove previous chart before creating a new one
        //
        if(undefined !== compositionChart) {
            compositionChart.destroy()
        }
        compositionChart = new Chart(canvas, chartConfig);

    }


    return {
        'generate': generateRandomModel, 
        'cluster': cluster, 
        'plot': plot, 
        'plotLabels': plotGeneratedLabels,
        'plotComposition': plotClusterComposition
    };
});

