//
// uses requirejs modules
//
define(function (require) {
    "use strict";

    const kmeans = require("./kmeans");

    /**
     * @return a random, normally distributed number
     */
    function randomNormal() {
        // n = 6 gives a good enough approximation
        return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
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
        const magnitude = Math.sqrt(magnitude);
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
     * Generate a spherical random vector
     * 
     * @param {Integer} n number of data points
     * @param {Integer} d dimension of data
     * @param {Number} r radium from center for data point
     * @return n random datapoints of dimension d
     */
    function randomSphericalVector(d, r) {
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
        }

        return observation;
    }



    /**
     * Generate a spherical random vectors
     * 
     * @param {Integer} n number of data points
     * @param {Integer} d dimension of data
     * @param {Number} max radius from center for data points
     * @return n random datapoints of dimension d
     */
    function randomSphericalVectors(n, d, r) {

        // create n random observations, each of dimension d
        const observations = [];
        for(let i = 0; i < n; i += 1) {
            // create random observation of dimension d with random radius
            const observation = randomSphericalVector(d, Math.random() * r);
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
    function randomVectors(n, d, min, max) {

        const range = max - min;

        // create n random observations, each of dimension d
        const observations = [];
        for(let i = 0; i < n; i += 1) {
            // create random observation of dimension d
            const observation = randomVector(d, min, max);
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
    function randomVector(d, min, max) {

        // create random observation of dimension d
        const range = max - min;
        const observation = [];
        for(let j = 0; j < d; j += 1) {
            observation.push(min + Math.random() * range);
        }

        return observation;
    }

    return {
        'randomVector': randomVector,
        'randomUnitVector': randomUnitVector,
        'randomSphericalVector': randomSphericalVector,
        'randomVectors': randomVectors,
        'randomUnitVectors': randomUnitVectors,
        'randomSphericalVectors': randomSphericalVectors
    }

});

