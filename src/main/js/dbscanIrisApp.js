//
// uses requirejs modules
//

/**
 * application to cluster the Iris data set using kmeans
 * 
 * cluster(k) - learn k clusters from the Iris dataset
 * measureClusterCompositions(clusters) - calculate the count and percentage that each labelled species takes in each learned cluster
 * plot(canvas, results) - plot the results of cluster(k) onto the given canvas
 * plotIrisLabels(canvas) - plot the true iris labelled data
 * plotClusterComposition(canvas, results) - plot the results of measureClusterCompositions(clusters) to the given canvas as a bar chart
 * 
 */
define(function (require) {
    "use strict";
    const iris = require("./dataset/iris");
    const dbscan = require("./dbscan/dbscan");
    const euclidean = require("./distance/euclideanDistance");


    /**
     * @public
     * Load iris dataset and run DBSCAN on it on it using Euclidean distance
     * 
     * @param {number} epslilon maximum distance for point to be in neighborhood
     * @param {number} minimumPoints minimum number of points in neighborhood for a core point
     * @return {*} results with model (observations, assignments), clusters and clusterCompositions
     */
    function cluster(epsilon, minimumPoints) {

        //
        // map iris data rows from dictionary to vector (array), leaving out the label
        //
        const observations = iris.map(x => [x.sepalLength, x.sepalWidth, x.petalLength, x.petalWidth]);
        const n = observations.length;

        //
        // create the intial model and run it
        //
        const results = dbscan.cluster(observations, euclidean.distance, epsilon, minimumPoints);
        const clusters = dbscan.assignmentsToClusters(results.model);
        const clusterCompositions = measureClusterCompositions(clusters.clusters, clusters.outliers);

        return {
            'model': results.model,
            'clusters': clusters.clusters,
            'outliers': clusters.outliers,
            'clusterCompositions': clusterCompositions,
            'iterations': results.iterations,
            'durationMs': results.durationMs
        };
    }

    /**
     * @private
     * using the iris data labels, 
     * calculate the proportion of each species
     * in the cluster.  
     *
     * So if 1/4 of the versicolor data points
     * are in cluster0, then report 25% versicolor.
     * Note that a cluster will have 3 labels and they
     * may not add up to 100% for that cluster, but 
     * each species will add up to 100% over all clusters.
     * 
     * @param {clusters} array of observation indicies (iris row) for each cluster
     * @return map of species to percent for each cluster (centroid)
     */
    function measureClusterCompositions(clusters, outliers) {

        /**
         * count each type of iris in the cluster.
         * @param {*} cluster 
         * @return {*} object with cluster count for each iris type
         */
        function computeClusterCounts(cluster) {
            const composition = {'setosa': 0, 'versicolor': 0, 'virginica': 0};
            cluster.forEach(observationIndex => composition[iris[observationIndex].species] += 1 );
            return composition;
        }

        /**
         * Use count of each iris type to compute the percetage composition if the cluster.
         * @param {*} clusterComposition 
         */
        function mapClusterCountToPercentage(clusterComposition) {
            return {
                'setosa': {count: clusterComposition.setosa, percent: clusterComposition.setosa / speciesCounts.setosa},
                'versicolor': {count: clusterComposition.versicolor, percent: clusterComposition.versicolor / speciesCounts.versicolor},
                'virginica': {count: clusterComposition.virginica, percent: clusterComposition.virginica / speciesCounts.virginica}
            }
        }

        //
        // count total number of each species using labels given in the dataset
        //
        const speciesCounts = {'setosa': 0, 'versicolor': 0, 'virginica': 0};
        iris.forEach(observation => speciesCounts[observation.species] += 1)

        //
        // count how many of each species in each cluster
        //
        const clusterCounts = clusters.map(c => computeClusterCounts(c));
        const outlierCounts = computeClusterCounts(outliers);

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

    const clusterColor = ['red', 'green', 'blue', 'yellow', 'purple', 'cyan', 'magenta'];
    const speciesColor = {'setosa': 'cyan', 'versicolor': 'yellow', 'virginica': 'magenta'};
    const species = ['setosa', 'versicolor', 'virginica'];

    let chart = undefined;
    let irisChart = undefined;
    let compositionChart = undefined;


    /**
     * plot the clustred iris data model.
     * 
     * @param {object} results of cluster(), with model, clusters and clusterCompositions
     * @param {boolean} showClusterColor true to show learned cluster points
     * @param {boolean} showSpeciesColor true to show known dataset labelled points
     */
    function plot(canvas, results, showClusterColor, showSpeciesColor) {

        //
        // map iris data rows from dictionary to vector (array), leaving out the label
        //
        const model = results.model;
        const observations = model.observations;
        const assignments = model.assignments;
        const n = observations.length;

        // 
        // add the outliers as the last cluster
        //
        const clusters = [];
        results.clusters.forEach(c => clusters.push(c));
        clusters.push(results.outliers);
        const k = clusters.length;
        const clusterCompositions = results.clusterCompositions;
        const parameters = model.parameters;

        console.log(JSON.stringify(clusterCompositions));

        //
        // plot the clusters
        //
        const chartData = {
            // for the purposes of plotting in 2 dimensions, we will use 
            // x = sepalLength and y = sepalWidth 
            datasets: clusters.map(function(c, i) { 
                return {
                    label: (i === k-1) ? "outliers" : (showClusterColor ? ("cluster" + i) : (showSpeciesColor ? species[i] : undefined)),
                    data: c.map(d => ({'x': observations[d][0], 'y': observations[d][1]})),
                    backgroundColor: showClusterColor ? clusterColor[i % clusterColor.length] : (showSpeciesColor ? speciesColor[species[i]] : undefined),
                    pointBackgroundColor: showClusterColor ? clusterColor[i % clusterColor.length] : (showSpeciesColor ? c.map(d => speciesColor[iris[d]['species']]) : 'white'),
                    pointBorderColor: showClusterColor ? clusterColor[i % clusterColor.length] : (showSpeciesColor ? c.map(d => speciesColor[iris[d]['species']]) : 'white')
                };
            })
        };

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: showClusterColor ? 'Iris data set clustered using dbscan (ε=$e, m=$m)'.replace('$e', parameters.e).replace("$m", parameters.m) : "Iris data set"
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
                        labelString: 'sepal length in cm',
                        display: true,
                    }
                }],
                yAxes: [{
                    type: 'linear',
                    position: 'left',
                    scaleLabel: {
                        labelString: 'sepal width in cm',
                        display: true
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    label: (tooltipItem, data) => 
                        (iris[clusters[tooltipItem.datasetIndex][tooltipItem.index]].species 
                            + ": [x, y]".replace("x", tooltipItem.xLabel).replace("y", tooltipItem.yLabel)),
                    labelColor: (tooltipItem, data) => ({'backgroundColor': speciesColor[iris[clusters[tooltipItem.datasetIndex][tooltipItem.index]].species]})
                }
            }
        };

        // destroy previous chart so it's interactivity is removed
        if(undefined !== chart) {
            chart.destroy();
        }
        chart = new Chart(canvas, {
            type: 'scatter',
            data: chartData,
            options: chartOptions
        });
    }

    /**
     * plot the clustred iris data model.
     * 
     * @param {object} results of cluster(), with model, clusters and clusterCompositions
     * @param {boolean} showClusterColor true to show learned cluster points
     * @param {boolean} showSpeciesColor true to show known dataset labelled points
     */
    function plotIrisLabels(canvas) {
        //
        // plot the unclustered iris data using the given species labels
        //
        const speciesColor = {'setosa': 'cyan', 'versicolor': 'yellow', 'virginica': 'magenta'};
        const species = ['setosa', 'versicolor', 'virginica'];

        // for the purposes of plotting in 2 dimensions, we will use 
        // x = sepalLength and y = sepalWidth 
        const datasets = species.map(function(value) { 
            return {
                label: value,
                data: iris.filter(x => x.species === value).map(v => ({'x': v['sepalLength'], 'y': v['sepalWidth']})),
                backgroundColor: speciesColor[value],
                pointBackgroundColor: speciesColor[value],
                pointBorderColor: speciesColor[value]
            };
        })

        //
        // remove previous chart before creating new one
        //
        if(undefined !== irisChart) {
            irisChart.destroy();
        }
        irisChart = new Chart(canvas, {
            type: 'scatter',
            data: {
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: "Iris data set"
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
                            labelString: 'sepal length in cm',
                            display: true,
                        }
                    }],
                    yAxes: [{
                        type: 'linear',
                        position: 'left',
                        scaleLabel: {
                            labelString: 'sepal width in cm',
                            display: true
                        }
                    }]
                }
            }
        });
    }

    function plotClusterComposition(canvas, results) {

        //
        // combine the clusters' composition and outlier compositions
        //
        const clusterCompositions = [];
        results.clusterCompositions.clusterCompositions.forEach(cc => clusterCompositions.push(cc));
        clusterCompositions.push(results.clusterCompositions.outlierComposition);

        const k = clusterCompositions.length;
        const speciesColor = {'setosa': 'cyan', 'versicolor': 'yellow', 'virginica': 'magenta'};
        const species = ['setosa', 'versicolor', 'virginica'];

        const datasets = species.map((sp, i) => ({
                label: sp,
                data: clusterCompositions.map(cc => cc[sp].percent),
                backgroundColor: speciesColor[sp]
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
                    text: "DBSCAN cluster composition (k=$k), Iris data set".replace("$k", k-1)
                },
                legend: {
                    position: 'bottom',
                    display: true
                },
                tooltips: {
                    callbacks: {
                        label: (tooltipItem, data) => species[tooltipItem.datasetIndex] + ": " + Math.floor(clusterCompositions[tooltipItem.index][species[tooltipItem.datasetIndex]].percent * 1000) / 10 + "%",
                        labelColor: (tooltipItem, data) => ({'backgroundColor': speciesColor[species[tooltipItem.datasetIndex]]})
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

    return {'cluster': cluster, 'plot': plot, 'plotIrisLabels': plotIrisLabels, 'plotClusterComposition': plotClusterComposition};
});

