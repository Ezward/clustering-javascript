define(function () {
    "use strict";
    
    /**
     * @public
     * Calculate the squared Euclidean distance between two vectors.
     *
     * @param [number] p vector with same dimension as q
     * @param [number] q vector with same dimension as p
     * @return {number} the distance between p and q squared
     */
    function distanceSquared(p, q) {
        const d = p.length; // dimension of vectors

        if(d !== q.length) throw Error("p and q vectors must be the same length")

        let sum = 0;
        for(let i = 0; i < d; i += 1) {
            sum += (p[i] - q[i])**2
        }
        return sum;
    }

    /**
     * @public
     * Calculate the Euclidean distance between two vectors of the same dimension.
     *
     * @param [number] p vector of same dimension as q
     * @param [number] q vector of same dimension as p
     * @return the distance between vectors p and q
     */
    function distance(p, q) {
        return Math.sqrt(distanceSquared(p, q));
    }

    //
    // return public exports
    //
    return {
        'distance': distance,
        'distanceSquared': distanceSquared
    };
});
