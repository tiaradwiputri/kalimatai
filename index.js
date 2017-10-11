"use strict";

let config = require('./config.json');
let Injector = require('./Injector.js');
let injector = new Injector(config);
injector.start();