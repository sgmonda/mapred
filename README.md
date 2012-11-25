This is a native NodeJS MapReduce implementation.

This is a very young project. Be patient.

Install
=======

To install the most recent release from npm, run:

    npm install mapred

Use
====

To load this module, simply write the following (where 1 is the count of cores):

```javascript
var mapreduce = require('mapred')(1);
```

Then, you can use mapreduce function in your code:

```javascript
var result = mapreduce(information, function(key, value){
    // Your map() implementation
}, function(key, values){
    // Your reduce() implementation
});
```

Obviously, to use MapReduce (according to [Google's MapReduce specification](http://research.google.com/archive/mapreduce.html)) you have to implement two functions:

* ``map(key1, value1) -> list(key2, value2)``: takes an input pair and produces a set of intermediate key/value pairs.
* ``reduce(key2, list(value2)) -> list(value2)``: accepts an intermediate key and a set of values for that key, and merges togetuer these values to form a possibly smaller set of values.

Example
-------

The most commonly used example use of MapReduce is counting the number of occurrences of each word in a collection of texts. With ``mapred`` module, you can do it as follows:

Then, you can use mapreduce function in your code:

```javascript
var mapreduce = require('mapred')(1); // 1 = single core version

// Information to process =====================================================

var information = [
    ['frase primera', 'primer trozo de informacion para procesado primer trozo'],
    ['segunda frase', 'segundo trozo de informacion trozo de'],
    ['último cacho', 'otro trozo para ser procesado otro otro otro trozo']
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

var count = mapreduce(information, map, reduce);
console.log(count);

```

If you save the code above into a file called ``mapreduce_example.js`` and you run it with

    node mapreduce_example.js

You'll get the following

    { de: 3,
      informacion: 2,
      otro: 4,
      para: 2,
      primer: 2,
      procesado: 2,
      segundo: 1,
      ser: 1,
      trozo: 6 }

