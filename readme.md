# K-Means Clustering in JavaScript

An implementation of the kmeans and kmeans++ algorithms in JavaScript.  Examples use the Iris data set and a random data generator.


### Dataset
* dataset/iris.js - the Iris data set in json format.

### Kmeans core
* kmeans/kmeans.js - the kmeans algorithm and some helpers, such as distance(p, q). 
* kmeans/kmeanspp.js - the kmeans++ initialization algorithm
* kmeans/kmeansRandomModel.js - generator for various random models for use with kmeans
* kmeans/randomCentroidInitializer.js - initializer using random centroid algorithm

### Loader
* loader/loader.js - this is a requirejs compatible loader compatible the enables "View Source" (see more below).  

### Cluster Iris data application
* kmeansiris.html - page that shows iris data set and kmeans clustering and cluster composition.
* kmeansIrisApp.js - module to cluster and plot the iris data set.
* kmeansIrisMain.js - main module for clustering iris data; entry point called by kmeansiris.html
* kmeansIrisRequireConfig.js - requirejs config for kmeans iris application

### Cluster random data application
* kmeansrandom.html - page thas show kmeans clustering of random spherical data.
* kmeansRandomApp.js - module to cluster randomly generated data
* kmeansRandomMain.js - main module for clustering random data; entry point called by kmeansrandom.html
* kmeansRandomRequireConfig.js - requirejs config for kmeans random application

### Dependancies
The core module has no dependancies except that is uses requirejs modules, so a module loader must be present.  Chartjs is used for showing the plots.  There are no other dependancies.

#### Notes on loader
There is a requirejs compatible loader at loader/loader.js.  This allows for a subset of requirejs syntax, but requires the scripts to be loaded in script tags.  The points is to enable "View Source" while still using requirejs modules in these pages.  However, by commenting out the script tags and uncommenting the requirejs script tag, this can be run as a standard requirejs application.



