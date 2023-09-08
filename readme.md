# Clustering in JavaScript

An implementation of the k-means, k-means++ and DBSCAN algorithms in JavaScript.  Examples use the Iris data set and a random data generator.
* [KMeans on the Iris Data Set](https://ezward.github.io/clustering-javascript/kmeansiris.html)
* [KMeans, KMeans++ and DBSCAN on randomly generated data](https://ezward.github.io/clustering-javascript/kmeansrandom.html)
* [DBSCAN on the Iris Data Set](https://ezward.github.io/clustering-javascript/dbscaniris.html)

Clustering is a unsupervised learning task. Our data has no labels. The task is to learn labels from the data – to learn structure inherent in the data. K-means/K-means++ and DBSCAN go about this in different ways.  K-means/K-means++ algorithms take a single parameter; the number of clusters we expect to find in the data.  The algorithm will then attempt to assign every data element in the dataset to to one of the N clusters.  DBSCAN on the other hand is given two parameters that define what a cluster is based on it's density; the number of data points within its area; it then works to find such areas.  So where K-means/K-means++ will always find a specified number of clusters and there will never be outliers, DBSCAN will find zero of more clusters and may also find zero or more outliers; points that don't fall within a cluster.  An important aspect of DBSCAN is that it can find oddly shaped clusters, where KMeans/Kmeans++ cannot. 

## Kmeans Algorithm
0. Initialize the cluster centers. K-means chooses initial centers at random.  The k-means++ method uses a algorithm to spread out the initial set of centroids so that they are not too close together.
1. Assign each observation to the cluster center closest to it.
2. Revise each cluster center to be the mean of its assigned observations.
3. Repeat 1 and 2 until convergence (until the cluster assignments stop changing within some limit).

A detailed discussion of kmeans and the kmeans++ initialization algorithm can be found [here](https://github.com/Ezward/machinelearningnotes/tree/master/Clustering%20and%20Retrieval/week%203%20-%20Clustering%20with%20k-means)

## DBSCAN Algorithm
The DBSCAN algorithm takes two parameters that define what a cluster is based on it's density; an area as the radius of a circle and the miniumum number of data points that must within that area to be considered a cluster.  The algorithm works to find such areas.  Epsilon is the radius of the circle to be created around each data point to check the density and minPoints is the minimum number of data points required inside that circle for that data point to be classified as a Core point. A data point is a Core point if the circle around it contains at least ‘minPoints’ number of points. If the number of points is less than minPoints, then it is classified as Border Point, and if there are no other data points around any data point within epsilon radius, then it treated as Noise.

- Start a new cluster
- For each data point
  - If the the point is not already assigned to a cluster
    - Find the neighbors of the data point; the points in the epsilon neighborhood of the point.
      - If the data point has less than minPoints neighbors then it is an outlier.
      - If the data point has >= minPoints neighbors then it is a core point of the current cluster.
      - If the data point is a core point of the current cluster then for each of its neighbors
        - Find the neighbor's neighbors (the expanded neighbors).
        - For each expanded neighbor
          - If the expanded neighbor is marked as an outlier of a prior cluster, then make it a member of the current cluster
          - If the expanded neighbor is not yet assigned to a cluster, then make it a neighbor of the core point so that it will get processed.
        - Continue until all the core point's neighbors are processed.
        - Start a new cluster.

A detailed discussion of DBSCAN can be found [here](https://en.wikipedia.org/wiki/DBSCAN).

## Description of Source Files

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



