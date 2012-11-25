/**
 * NodeJS native MapReduce implementation
 */

var cluster = require('cluster'),
    cores = require('os').cpus().length;

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
var mapreduce_simple = function(pieces, map, reduce, callback){
    
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
    
    callback(groups);
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
var mapreduce_cluster = function(pieces, map, reduce, callback){
    if(cluster.isMaster){
    
        // Master process

        for(var i = 0; i < cores; i++){
            var worker = cluster.fork(), finished = 0, full_intermediate = [];
            
            worker.on('message', function(msg){
                if(msg.about == 'mapfinish'){
                    full_intermediate = full_intermediate.concat(msg.intermediate);
                }
            });

            worker.on('exit', function(){
                finished++;
                if(finished == cores){

                    full_intermediate.sort();

                    groups = full_intermediate.reduce(function(res, current){
                        var group = res[current[0]] || [];
                        group.push(current[1]);
                        res[current[0]] = group;
                        return res; 
                    }, {});

                    for(var k in groups){
                        groups[k] = reduce(k, groups[k]);
                    }
                    
                    callback(groups);

                }
            });
            
        }

                
    }else{
    
        // Child process

        var pieces_processed = 0;
        var mypiece = pieces[cluster.worker.id - 1];
        var myintermediate = [];
        
        while(mypiece){
            
            // Map
            
            var key = mypiece[0], value = mypiece[1], groups = {};
            myintermediate = myintermediate.concat(map(key, value));            
            
            pieces_processed++;
            mypiece = pieces[(cluster.worker.id - 1) + (pieces_processed) * cores];

        }
        
        process.send({
            from: cluster.worker.id, 
            about: 'mapfinish', 
            intermediate: myintermediate
        });
        
        cluster.worker.destroy();
    
    }
    
};

/**
 * Export depending on cores count
 * 
 * @param {number} count of cores
 */
module.exports = function(c){        
    cores = c || cores;
//    if(cores == 1) return mapreduce_simple;
    return mapreduce_cluster;
};

