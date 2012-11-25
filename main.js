/**
 * NodeJS native MapReduce implementation
 */




/**
 * MapReduce function (single thread version), based on Google works
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
var mapreduce_simple = function(pieces, map, reduce){
    
    var intermediate = [], groups = null;
    
    pieces.forEach(function(elem, index){
        var key = elem[0], value = elem[1];
        intermediate = intermediate.concat(map(key, value));
    });
    
    intermediate.sort();
    
    groups = intermediate.reduce(function(res, current){
        var group = res[current[0]] || [];
        group.push(current[1]);
        res[current[0]] = group;
        return res; 
    }, {});
    
    for(var k in groups){
        groups[k] = reduce(k, groups[k]);
    }
    
    return groups;
};

/**
 * MapReduce function (multi-core version), based on Google works
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
var mapreduce_cluster = function(pieces, map, reduce){    
    return {};
};

/**
 * Export depending on cores count
 * 
 * @param {number} count of cores
 */
module.exports = function(cores){
    cores = cores || 1;
    if(cores == 1) return mapreduce_simple;
    return mapreduce_cluster;
};

