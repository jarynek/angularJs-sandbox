const angularClass = require('angular');
const filterClass = require('angular-filter');

/**
 * import controllers
 */

import classController from './controllers/classController';
import usersController from './controllers/usersController';

angularClass.module('appClass', [filterClass])
    .controller('classController', classController)
    .controller('usersController', usersController);
