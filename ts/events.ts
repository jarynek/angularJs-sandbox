const angularEvents = require('angular');
const filterEvents = require('angular-filter');

angularEvents.module('appEvents', [filterEvents])
    .factory('Services', function () {
        return {
            /**
             * setEventId
             * @param {object} arg
             * @return {parseInt} max ids
             */
            setEventId: (arg: any) => {
                let ids = [0];
                arg.map((list: any) => {
                    list.events.map((item: any) => {
                        ids.push(item.id);
                    });
                });
                return Math.max(...ids) + 1;
            }
        }
    })
    .controller('eventsController', function ($scope: any, $http: any, Services: any) {
        $scope.title = 'Events AngularJs';

        $scope.dragInit = false;

        /**
         * Draggable options
         */
        $scope.dragg = {
            left: null,
            top: null,
            source: null,
            event: null
        };

        /**
         * Lists
         */
        $scope.lists = [
            {id: 1, name: 'One', addEvent: false, events: []},
            {id: 2, name: 'Two', addEvent: false, events: []},
            {id: 3, name: 'Three', addEvent: false, events: []}
        ];

        /**
         * Templates
         */
        $scope.tpls = {
            events: {
                add: './tpl/events/add.form.html',
                event: './tpl/events/event.html'
            }
        };

        /**
         * Todos
         */
        $http.get('https://jsonplaceholder.typicode.com/todos')
            .then(function (response: any) {
                $scope.todos = response.data;
            });

        /**
         * Add event to list
         * @param {object} event
         */
        $scope.add = function (event: any) {
            let el = event.target;
            let list = el.closest('.list');

            if (!list) {
                return;
            }

            let id = list.getAttribute('data-list');

            $scope.lists.filter((item: any) => {
                if (item.id == id) {
                    item.addEvent = !item.addEvent;
                }
            });
        };

        /**
         * Save event in list
         * @param {object} event
         */
        $scope.save = function (event: any) {
            event.preventDefault();

            let el = event.target;
            let list = el.closest('.list');

            if (!list) {
                return;
            }

            let id = list.getAttribute('data-list');

            $scope.lists.filter((item: any) => {
                if (item.id == id) {
                    item.events.push({
                        id: Services.setEventId($scope.lists),
                        title: this.event.title,
                        edit: false
                    });
                    item.addEvent = false;
                }
            });
        };

        /**
         * editTask
         * @param {object} event
         */
        $scope.editTask = function (event: any) {
            event.preventDefault();

            let el = event.target.closest('.event');
            let eventId = el.getAttribute('data-event');
            let listId = el.closest('.list').getAttribute('data-list');

            $scope.lists.filter((list: any) => {
                if (list.id == listId) {
                    list.events.filter((event: any) => {
                        if (event.id == eventId) {
                            event.edit = !event.edit;
                        }
                    });
                }
            });
        };

        /**
         * dragEventInit
         */
        $scope.dragEventInit = function (event: any) {

            if (!event.target) {
                return;
            }

            let el = event.target.closest('.event');
            let clone = el.closest('.draggable').cloneNode(true);
            let body = document.getElementsByTagName('body');

            $scope.dragInit = true;
            $scope.dragg.left = event.pageX - el.getBoundingClientRect().left;
            $scope.dragg.top = event.pageY - el.getBoundingClientRect().top;
            $scope.dragg.source = el.closest('.list');
            $scope.dragg.event = el;

            el.classList.add('disabled');

            body[0].classList.add('lock');
            body[0].appendChild(clone);

            clone.classList.add('cloned', 'hdn');
        };

        /**
         * dragEventDestroy
         * @param {object} event
         */
        $scope.dragEventDestroy = function (event: any) {

            $scope.dragInit = false;

            let el = event.target;
            let target = el.closest('.list') ? el.closest('.list') : null;
            let cloned = document.getElementsByClassName('cloned');
            let body = document.getElementsByTagName('body');
            let disabled = document.getElementsByClassName('disabled');

            /**
             * Add event to list
             */
            if (target && cloned.length > 0 && target !== $scope.dragg.source) {
                let id = target.getAttribute('data-list');

                $scope.lists.filter((item: any) => {

                    if (item.id == id) {

                        /**
                         * Filter list
                         */
                        $scope.lists.filter((list: any) => {
                            if (list.id == $scope.dragg.source.getAttribute('data-list')) {

                                /**
                                 * Filter event
                                 */
                                list.events.filter((event: any) => {
                                    if (event.id == $scope.dragg.event.getAttribute('data-event')) {
                                        /**
                                         * Push event to target list
                                         */
                                        item.events.push(event);
                                        /**
                                         * Delete event form source list
                                         */
                                        list.events.splice(list.events.findIndex((item: any) => item.id === event.id), 1);
                                    }
                                });
                            }
                        });
                    }
                });
            }

            /**
             * Remove cloned
             */
            if (cloned.length > 0) {
                cloned[0].remove();
            }

            body[0].classList.remove('lock');
            if (disabled.length > 0) {
                disabled[0].classList.remove('disabled');
            }

            $scope.dragg.left = null;
            $scope.dragg.top = null;
            el = null;
            target = null;
            body = null;
        };

        /**
         * dragMove
         * @param {object} event
         */
        $scope.dragMove = function (event: any) {

            let el = event.target;

            if ($scope.dragInit == true) {
                let cloned = document.getElementsByClassName('cloned')[0];

                if (cloned) {
                    let left = (event.pageX - $scope.dragg.left);
                    let top = (event.pageY - $scope.dragg.top);
                    let target = el.closest('.list') ? el.closest('.list') : null;

                    cloned.classList.remove('hdn');
                    cloned.setAttribute('style', 'width: ' + $scope.dragg.event.getBoundingClientRect().width + 'px ;left:' + left + 'px; top: ' + top + 'px');

                    /**
                     * Remove class active
                     */
                    document.querySelectorAll('.active').forEach(function (item) {
                        item.classList.remove('active');
                    });

                    if (target !== null) {
                        let listId = target.getAttribute('data-list');

                        target.classList.add('active');
                    }
                }
            }
        };
    });