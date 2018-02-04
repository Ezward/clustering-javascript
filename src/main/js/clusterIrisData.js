//
// uses requirejs modules
//
define(function (require) {
    "use strict";
    const iris = require("./dataset/iris");
    const kmeans = require("./kmeans/kmeans");
    const kmeanspp = require("./kmeans/kmeanspp");
    const randomCentroidInitializer = require("./kmeans/randomCentroidInitializer");


    /**
     * @public
     * Load iris dataset and run kmeans on it given the number of clusters
     * 
     * @param {integer} k number of clusters to create
     */
    function cluster(k) {

        //
        // map iris data rows from dictionary to vector (array), leaving out the label
        //
        const observations = iris.map(x => [x.sepalLength, x.sepalWidth, x.petalLength, x.petalWidth]);
        const n = observations.length;

        //
        // create the intial model and run it
        //
        const initialModel = randomCentroidInitializer(observations, k);
        // const initialModel = kmeanspp(observations, k);
        const results = kmeans.cluster(initialModel);

        results.clusters = assignmentsToClusters(results.model);
        results.clusterCompositions = measureClusterCompositions(results.clusters);

        return results;
    }

    /**
     * Use the model assignments to create
     * array of observation indices for each centroid
     * 
     * @param {object} model with observations, centroids and assignments
     * @reutrn [[number]] array of observation indices for each cluster
     */
    function assignmentsToClusters(model) {
        // 
        // put offset of each data points into clusters using the assignments
        //
        const n = model.observations.length;
        const k = model.centroids.length;
        const assignments = model.assignments;
        const clusters = [];
        for(let i = 0; i < k; i += 1) {
            clusters.push([])
        }
        for(let i = 0; i < n; i += 1) {
            clusters[assignments[i]].push(i);
        }

        return clusters;
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
    function measureClusterCompositions(clusters) {
        //
        // count number of each species using labels given in the dataset
        //
        const speciesCounts = {'setosa': 0, 'versicolor': 0, 'virginica': 0};
        iris.forEach(observation => speciesCounts[observation.species] += 1)

        //
        // count how many of each species in each cluster
        //
        const clusterCompositions = clusters.map(c => {
            const composition = {'setosa': 0, 'versicolor': 0, 'virginica': 0};
            c.forEach(observationIndex => composition[iris[observationIndex].species] += 1 );
            return composition;
        });

        //
        // turn counts into percentages
        //
        return clusterCompositions.map(clusterComposition => ({
            'setosa': clusterComposition.setosa / speciesCounts.setosa,
            'versicolor': clusterComposition.versicolor / speciesCounts.versicolor,
            'virginica': clusterComposition.virginica / speciesCounts.virginica}));
    }

    /**
     * plot the clustred iris data model.
     * 
     * @param {object} model with observations, centroids and assignments
     * @param {boolean} showClusterColor true to show learned cluster points
     * @param {boolean} showSpeciesColor true to show known dataset labelled points
     */
    function plot(model, showClusterColor, showSpeciesColor) {

        //
        // map iris data rows from dictionary to vector (array), leaving out the label
        //
        const observations = model.observations;
        const assignments = model.assignments;
        const centroids = model.centroids;
        const n = observations.length;
        const k = centroids.length;

        // 
        // put offset of each data points into clusters using the assignments
        //
        const clusters = assignmentsToClusters(model);
        const clusterCompositions = measureClusterCompositions(clusters);

        console.log(JSON.stringify(clusterCompositions));

        //
        // plot the clusters
        //
        const clusterColor = ['red', 'green', 'blue', 'yellow', 'purple', 'cyan', 'magenta'];
        const speciesColor = {'setosa': 'cyan', 'versicolor': 'yellow', 'virginica': 'magenta'};
        const species = ['setosa', 'versicolor', 'virginica'];
        const canvas = document.querySelector("#container canvas");
        const chart = new Chart(canvas, {
            type: 'scatter',
            data: {
                // for the purposes of plotting in 2 dimensions, we will use 
                // x = sepalLength and y = sepalWidth, so map the 
                datasets: clusters.map(function(c, i) { 
                    return {
                        label: showClusterColor ? ("cluster" + i) : (showSpeciesColor ? species[i] : undefined),
                        data: c.map(d => ({'x': observations[d][0], 'y': observations[d][1]})),
                        backgroundColor: showClusterColor ? clusterColor[i % clusterColor.length] : (showSpeciesColor ? speciesColor[species[i]] : undefined),
                        pointBackgroundColor: showClusterColor ? clusterColor[i % clusterColor.length] : (showSpeciesColor ? c.map(d => speciesColor[iris[d]['species']]) : 'white'),
                        pointBorderColor: showClusterColor ? clusterColor[i % clusterColor.length] : (showSpeciesColor ? c.map(d => speciesColor[iris[d]['species']]) : 'white')
                    };
                })
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: 'Iris data set clustered using K-Means'
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

    return {'cluster': cluster, 'plot': plot};
});

