/**
 * NodeJS native MapReduce implementation
 */




/**
 * MapReduce function, based on Google works
 * 
 * @param {array} pieces : information fragments to be processed
 * 
 * @param {function} map : map function, which must take an input key-value 
 * pair and produce a set of intermediate key-value pairs.
 * 
 * @param {function} reduce : reduce function, which must accept an intermediate 
 * key and a set of values for that key. It merges together these values to 
 * form a possibly smaller set of values.
 */
module.exports = function(pieces, map, reduce){
    
    var intermediate = [], groups = {};
    
    pieces.forEach(function(elem, index){
        var key = elem[0], value = elem[1];
        intermediate = intermediate.concat(map(key, value));
    });
    
    // more things TO DO
    intermediate.sort();
    console.log('intermediate: ', intermediate);
    var grouped = intermediate.reduce(function(res, current){
        
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<
        
        return res.concat(current); 
    }, []);
    console.log('grouped: ', grouped);
    
    console.log('pieces: ' + pieces);
    console.log('map: '+ map());
    console.log('reduce: '+ reduce());
};

