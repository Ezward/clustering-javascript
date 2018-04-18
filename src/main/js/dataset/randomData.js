//
// uses requirejs modules
//

/**
 * module for creating random data sets
 */
define(function (require) {
    "use strict";

    /**
     * @return a random, normally distributed number
     */
    function randomNormal() {
        // n = 10 gives a good enough approximation
        return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() 
            + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 5) / 5;
    }

    /**
     * Generate a uniform random unit vector
     * 
     * @param {Integer} d dimension of data
     * @return n random datapoints of dimension d with length == 1
     */
    function randomUnitVector(d) {
        const range = max - min;
        let magnitude = 0.0;
        const observation = [];

        // uniform random for each dimension
        for(let j = 0; j < d; j += 1) {
            const x = Math.random();
            observation[j] = x;
            magnitude = x * x;
        }

        // normalize
        magnitude = Math.sqrt(magnitude);
        for(let j = 0; j < d; j += 1) {
            observation[j] /= magnitude;
        }

        return observation;
    }

    /**
     * Generate a uniform random unit vectors for clustering
     * 
     * @param {Integer} n number of data points
     * @param {Integer} d dimension of data
     * @return n random datapoints of dimension d with length == 1
     */
    function randomUnitVectors(n, d) {

        // create n random observations, each of dimension d
        const observations = [];
        for(let i = 0; i < n; i += 1) {
            // create random observation of dimension d
            const observation = randomUnitVector(d);
            observations.push(observation);
        }

        return observations;
    }

    /**
     * Generate a random normal vector
     * 
     * @param {Integer} d dimension of data
     * @param {Number} r radium from center for data point
     * @param {number} center d dimensional point that is center of distribution
     * @return n random datapoints of dimension d
     */
    function randomNormalVector(d, center) {
        if(center && (center.length !== d)) {
            throw Error("center must be d-dimensional");
        }

        const observation = [];

        let magnitude = 0.0;
        for(let j = 0; j < d; j += 1)
        {
            const x = randomNormal();
            observation[j] = x;
            if(center) {
                observation[j] += center[j];
            }
        }

        return observation;
    }


    function randomNormalVectors(n, d, center) {
        if(center && (center.length !== d)) {
            throw Error("center must be d-dimensional");
        }
        // create n random observations, each of dimension d
        const observations = [];
        for(let i = 0; i < n; i += 1) {
            // create random observation of dimension d with random radius
            const observation = randomNormalVector(d, center);
            observations.push(observation);
        }

        return observations;
    }



    /**
     * Generate a spherical random vector
     * 
     * @param {Integer} d dimension of data
     * @param {Number} r radium from center for data point
     * @param {number} center d dimensional point that is center of distribution
     * @return n random datapoints of dimension d
     */
    function randomSphericalVector(d, r, center) {
        if(center && (center.length !== d)) {
            throw Error("center must be d-dimensional");
        }

        const observation = [];
        let magnitude = 0.0;
        for(let j = 0; j < d; j += 1)
        {
            const x = randomNormal();
            observation[j] = x;
            magnitude += x * x;
        }

        // normalize
        magnitude = Math.sqrt(magnitude);
        for(let j = 0; j < d; j += 1) {
            observation[j] = observation[j] * r / magnitude;
            if(center) {
                observation[j] += center[j];
            }
        }

        return observation;
    }



    /**
     * Generate a spherical random vectors
     * 
     * @param {Integer} n number of data points
     * @param {Integer} d dimension of data
     * @param {Number} max radius from center for data points
     * @param {number} center d dimensional point that is center of distribution
     * @return n random datapoints of dimension d
     */
    function randomSphericalVectors(n, d, r, center) {
        if(center && (center.length !== d)) {
            throw Error("center must be d-dimensional");
        }

        // create n random observations, each of dimension d
        const observations = [];
        for(let i = 0; i < n; i += 1) {
            // create random observation of dimension d with random radius
            const observation = randomSphericalVector(d, Math.random() * r, center);
            observations.push(observation);
        }

        return observations;
    }

    /**
     * Generate a uniform random model for clustering
     * 
     * @param {Integer} n number of data points
     * @param {Integer} d dimension of data
     * @param {Number} radius of sphere
     * @return n random datapoints of dimension d
     */
    function randomVectors(n, d, center) {
        // create n random observations, each of dimension d
        const observations = [];
        for(let i = 0; i < n; i += 1) {
            // create random observation of dimension d
            const observation = randomVector(d, 1.0, center);
            observations.push(observation);
        }

        return observations;
    }

    /**
     * Generate a uniform random model for clustering
     * 
     * @param {Integer} d dimension of data
     * @param {Number} radius of sphere
     * @return n random datapoints of dimension d
     */
    function randomVector(d, spread, center) {

        // create random observation of dimension d
        const observation = [];
        for(let j = 0; j < d; j += 1) {
            observation.push((Math.random() - 0.5) * spread);
            if(center) {
                observation[j] += center[j];
            }
        }

        return observation;
    }

    return {
        'randomNormal': randomNormal,
        'randomVector': randomVector,
        'randomUnitVector': randomUnitVector,
        'randomNormalVector': randomNormalVector,
        'randomSphericalVector': randomSphericalVector,
        'randomVectors': randomVectors,
        'randomUnitVectors': randomUnitVectors,
        'randomNormalVectors': randomNormalVectors,
        'randomSphericalVectors': randomSphericalVectors
    }

});

