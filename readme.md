# K-Means Clustering in JavaScript

An implementation of the kmeans and kmeans++ algorithms in JavaScript.  Examples use the Iris data set and a random data generator.
[KMeans on the Iris Data Set](https://ezward.github.io/kmeans-javascript/kmeansiris.html)
[KMeans on randomly generated data](https://ezward.github.io/kmeans-javascript/kmeansrandom.html)

### Dataset
* dataset/iris.js - the Iris data set in json format.

### Kmeans core
* kmeans/kmeans.js - the kmeans algorithm and some helpers, such as distance(p, q). 
* kmeans/kmeanspp.js - the kmeans++ initialization algorithm
* kmeans/kmeansRandomModel.js - generator for various random models for use with kmeans
* kmeans/randomCentroidInitializer.js - initializer using random centroid algorithm

### Loader
* loader/loader.js - this is a requirejs compatible module loader that enables "View Source" (see more below).  

### Cluster Iris data application
* kmeansiris.html - page that shows iris data set and kmeans clustering and cluster composition.
* kmeansIrisApp.js - module to cluster and plot the iris data set.
* kmeansIrisMain.js - main module for clustering iris data; entry point called by kmeansiris.html
* kmeansIrisRequireConfig.js - requirejs config for kmeans iris data application.  This is only used when requirejs is used as the module loader.

### Cluster random data application
* kmeansrandom.html - page thas show kmeans clustering of random spherical data.
* kmeansRandomApp.js - module to cluster randomly generated data
* kmeansRandomMain.js - main module for clustering random data; entry point called by kmeansrandom.html
* kmeansRandomRequireConfig.js - requirejs config for kmeans random data application.  This is only used when requirejs is used as the module loader.

### Dependancies
The core module has no dependancies except that is uses requirejs modules, so a module loader must be present.  A requirejs compatible loader is included in the source, but requirejs can be used instead (see below).  Chartjs is used for showing the plots.  There are no other dependancies.

#### Notes on loader
There is a requirejs compatible module loader at loader/loader.js.  This allows for a subset of requirejs syntax, but requires the scripts to be loaded in script tags.  The point is to enable "View Source" while still structuring the code using requirejs modules.  However, by commenting out the script tags in the html and uncommenting the requirejs script tag, the pages can be run as standard requirejs applications.



