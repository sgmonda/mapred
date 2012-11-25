Google's MapReduce implementation for NodeJS.

Install
=======

To install the most recent release from npm, run:

    npm install mapred

Use
====

To load this module, simply write the following

```javascript
var mapreduce = require('mapred')(); // multi-core execution (fastest)
//var mapreduce = require('mapred')(1); // 1 = single core version (slowest)
```

Then, you can use mapreduce function in your code:

```javascript
mapreduce(information, function(key, value){
    // Your map() implementation
}, function(key, values){
    // Your reduce() implementation
}, function(result){
   // This is your callback
});
```

Obviously, to use MapReduce (according to [Google's MapReduce specification](http://research.google.com/archive/mapreduce.html)) you have to implement two functions:

* ``map(key1, value1) -> list(key2, value2)``: takes an input pair and produces a set of intermediate key/value pairs.
* ``reduce(key2, list(value2)) -> list(value2)``: accepts an intermediate key and a set of values for that key, and merges together these values to form a possibly smaller set of values.

Example
-------

The most common example of using MapReduce is counting the number of occurrences of each word in a collection of texts. With ``mapred`` module, you can do it as follows:

```javascript
var mapreduce = require('mapred')(); // Leave blank for max performance
//var mapreduce = require('mapred')(1); // 1 = single core version (slowest)
//var mapreduce = require('mapred')(3); // Use a cluster of 3 processes

// Information to process =====================================================

var information = [
    ['frase primera', 'primer trozo de informacion para procesado primer trozo'],
    ['segunda frase', 'segundo trozo de informacion trozo de'],
    ['cacho 3', 'otro trozo para ser procesado otro otro otro trozo'],
    ['cuarta frase', 'primer trozo de informacion para procesado primer trozo'],
    ['frase 5', 'segundo trozo de informacion trozo de'],
    ['sexto cacho', 'otro trozo para ser procesado otro otro otro trozo']
];

// User map implementation =====================================================

var map = function(key, value){
    var list = [], aux = {};
    value = value.split(' ');
    value.forEach(function(w){
        aux[w] = (aux[w] || 0) + 1;
    });
    for(var k in aux){
        list.push([k, aux[k]]);
    }
    return list;
};

// User reduce implementation =================================================

var reduce = function(key, values){
    var sum = 0;
    values.forEach(function(e){
        sum += e;
    });
    return sum;
};

// MapReduce call =============================================================

mapreduce(information, map, reduce, function(result){
    console.log(result);
});

```

If you save the code above into a file called ``mapreduce_example.js`` and you run it with

    node mapreduce_example.js

You'll get the following

```
{ de: 6,
  informacion: 4,
  otro: 8,
  para: 4,
  primer: 4,
  procesado: 4,
  segundo: 2,
  ser: 2,
  trozo: 12 }
```


