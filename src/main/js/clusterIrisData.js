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
    return function(k) {

        //
        // map iris data rows from dictionary to vector (array), leaving out the label
        //
        const observations = iris.map(x => [x.sepalLength, x.sepalWidth, x.petalLength, x.petalWidth]);
        const n = observations.length;

        //
        // create the intial model and run it
        //
        // const initialModel = randomCentroidInitializer(observations, k);
        const initialModel = kmeanspp(observations, k);
        const results = kmeans.cluster(initialModel);
        console.dir(results, {depth: null, colors: true})

        // 
        // for the purposes of plotting in 2 dimensions, we will use 
        // x = sepalLength and y = sepalWidth, so map the 
        // observations into those 2 dimensions while
        // putting data points into clusters using the assignments
        //
        const clusters = [];
        for(let i = 0; i < k; i += 1) {
            clusters.push([])
        }
        for(let i = 0; i < n; i += 1) {
            clusters[results.model.assignments[i]].push({'x': results.model.observations[i][0], 'y': results.model.observations[i][1]});
        }
        console.dir(clusters, {depth: null, colors: true})

        //
        // plot the clusters
        //
        const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'cyan', 'magenta'];
        const canvas = document.querySelector("#container canvas");
        const chart = new Chart(canvas, {
            type: 'scatter',
            data: {
                datasets: clusters.map(function(x, i) { 
                    return {
                        label: "cluster" + i,
                        data: x,
                        backgroundColor: colors[i % colors.length],
                        pointBackgroundColor: colors[i % colors.length]
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

});

