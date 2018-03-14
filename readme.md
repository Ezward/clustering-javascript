# Clustering in JavaScript

An implementation of the kmeans, kmeans++ and DBSCAN algorithms in JavaScript.  Examples use the Iris data set and a random data generator.
* [KMeans on the Iris Data Set](https://ezward.github.io/clustering-javascript/kmeansiris.html)
* [KMeans, KMeans++ and DBSCAN on randomly generated data](https://ezward.github.io/clustering-javascript/kmeansrandom.html)
* [DBSCAN on the Iris Data Set](https://ezward.github.io/clustering-javascript/dbscaniris.html)

A detailed discussion of kmeans and the kmeans++ initialization algorithm can be found [here](https://github.com/Ezward/machinelearningnotes/tree/master/Clustering%20and%20Retrieval/week%203%20-%20Clustering%20with%20k-means)

### Dataset
* dataset/iris.js - the Iris data set in json format.
* dataset/randomData.js - generator for random observations of various types

### dbscan
* dbscan/dbscan.js - the dbscan algorithm

### distance
* distance/euclideanDistance.js - euclidean distance and distanceSquared

### Kmeans core
* kmeans/kmeans.js - the kmeans algorithm and some helpers, such as distance(p, q). 
* kmeans/kmeanspp.js - the kmeans++ initialization algorithm
* kmeans/randomCentroidInitializer.js - initializer using random centroid algorithm

### Loader
* loader/loader.js - this is a requirejs compatible module loader that enables "View Source" (see more below).  

### DBSCAN Cluster Iris data application
This application allows the user to view the Iris data set and cluster it using DBSCAN with chosen values for epsilon (e) and minimum density points (m).  The resulting cluster composition can be compared to the ground truth labels.
* dbscaniris.html - page that shows iris data set and DBSCAN clustering and cluster composition.
* dbscanIrisApp.js - module to cluster and plot the iris data set.
* dbscanIrisMain.js - main module for clustering iris data; entry point called by kmeansiris.html
* dbscanIrisRequireConfig.js - requirejs config for kmeans iris data application.  This is only used when requirejs is used as the module loader.


### kmeans Cluster Iris data application
This application allows the user to view the Iris data set and cluster it using K-Means with k = 3.  The resulting cluster composition can be compared to the ground truth labels.
* kmeansiris.html - page that shows iris data set and kmeans clustering and cluster composition.
* kmeansIrisApp.js - module to cluster and plot the iris data set.
* kmeansIrisMain.js - main module for clustering iris data; entry point called by kmeansiris.html
* kmeansIrisRequireConfig.js - requirejs config for kmeans iris data application.  This is only used when requirejs is used as the module loader.

### Cluster random data application
This application allows the user to generate various synthetic data sets using Gaussian, spherical or uniformly random data.  The user can then cluster the data with K-Means, K-Means++ and DBSCAN, choosing values for k, e and m as desired.  The resulting cluster composition can be compared the the ground truth labels created during data generation.
* kmeansrandom.html - page thas show kmeans clustering of random spherical data.
* kmeansRandomApp.js - module to cluster randomly generated data
* kmeansRandomMain.js - main module for clustering random data; entry point called by kmeansrandom.html
* kmeansRandomRequireConfig.js - requirejs config for kmeans random data application.  This is only used when requirejs is used as the module loader.

### Dependancies
The core module has no dependancies except that is uses requirejs modules, so a module loader must be present.  A requirejs compatible loader is included in the source, but requirejs can be used instead (see below).  Chartjs is used for showing the plots.  There are no other dependancies.

#### Notes on loader
There is a requirejs compatible module loader at loader/loader.js.  This allows for a subset of requirejs syntax, but requires the scripts to be loaded in script tags.  The point is to enable "View Source" while still structuring the code using requirejs modules.  However, by commenting out the script tags in the html and uncommenting the requirejs script tag, the pages can be run as standard requirejs applications.



