var d3 = require('d3');
var mapper = require('./mapper').create();

var streets = [
  {
    name: 'Highland Ave.',
    start: [0, 1],
    end: [20, 1]
  },
  {
    name: 'Gibbens St.',
    start: [0, 10],
    end: [20, 10]
  },
  {
    name: 'Cambria St.',
    start: [0, 20],
    end: [21, 20]
  },
  {
    name: 'Benton Rd.',
    start: [1, 0],
    end: [1, 20]
  },
  {
    name: 'Central St.',
    start: [20, 0],
    end: [20, 20]
  }
];

streets.forEach(mapper.renderStreet);
