const angularClass = require('angular');

/**
 * import controller
 */
import classController from './controllers/classController';

angularClass.module('appClass', [])
    .controller('classController', classController);