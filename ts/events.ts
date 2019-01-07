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
            },
            /**
             * Set placeholder
             * @param {object} el
             * @param {object} parent
             * @param {string} area
             */
            setPlaceholder: (el: any, parent: any, area: any) => {
                if (document.getElementsByClassName('placeholder').length > 0) {
                    document.getElementsByClassName('placeholder')[0].remove();
                }

                let placeholder = document.createElement("span");
                placeholder.className = 'placeholder';
                placeholder.setAttribute('style', 'height: ' + el.getBoundingClientRect().height + 'px');

                if (area == 'after') {
                    parent.parentNode.insertBefore(placeholder, parent.nextSibling);
                    return;
                }
                parent.parentNode.insertBefore(placeholder, parent);
            }
        }
    })
    .controller('eventsController', function ($scope: any, $http: any, Services: any) {
        $scope.title = 'Events AngularJs';

        $scope.dragInit = false;
        $scope.eventEdit = false;
        $scope.searchUserInit = false;

        /**
         * Draggable options
         */
        $scope.dragg = {
            left: null,
            top: null,
            source: null,
            event: null,
            index: null
        };

        /**
         * Default lists
         */
        $scope.listsDefault = [
            {id: 1, name: 'One', addEvent: false, events: []},
            {id: 2, name: 'Two', addEvent: false, events: []},
            {id: 3, name: 'Three', addEvent: false, events: []},
            {id: 4, name: 'Four', addEvent: false, events: []},
        ];
        $scope.eventsStorage = window.localStorage;
        $scope.lists = JSON.parse($scope.eventsStorage.getItem('events')) ? JSON.parse($scope.eventsStorage.getItem('events')) : $scope.listsDefault;

        /**
         * Templates
         */
        $scope.tpls = {
            events: {
                add: './tpl/events/add.form.html',
                edit: './tpl/events/edit.form.html',
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
         * Users
         */
        $http.get('https://jsonplaceholder.typicode.com/users')
            .then(function (response: any) {
                $scope.users = response.data;
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
                        title: this.addEvent,
                        edit: false,
                        index: item.events.length + 1
                    });
                    item.addEvent = false;
                }
            });

            /**
             * Save to locale storage
             */
            $scope.eventsStorage.setItem('events', JSON.stringify($scope.lists));
        };

        /**
         * editTask
         * @param {object} event
         */
        $scope.editEvent = function (event: any) {
            event.preventDefault();

            let el = event.target.closest('.event');
            let eventId = el.getAttribute('data-event');
            let listId = el.closest('.list').getAttribute('data-list');

            $scope.lists.filter((list: any) => {
                if (list.id == listId) {
                    list.events.filter((event: any) => {
                        if (event.id == eventId) {
                            event.edit = !event.edit;
                            $scope.thisEvent = event;
                        }
                    });
                }
            });

            $scope.eventEdit = !$scope.eventEdit;
        };

        /**
         * Save event
         * @param {object} event
         */
        $scope.saveEvent = function (event: any) {
            event.preventDefault();

            if (this.eventTitle) {
                $scope.thisEvent.title = this.eventTitle ? this.eventTitle : '...';
            }
            if (this.eventUser) {
                $scope.thisEvent.user = $scope.users.filter((user: any) => user.id == this.eventUser);
            }

            $scope.eventEdit = false;
            $scope.thisEvent = null;

            /**
             * Save to locale storage
             */
            $scope.eventsStorage.setItem('events', JSON.stringify($scope.lists));
        };

        $scope.searchUser = function () {
            $scope.searchUserInit = true;
            console.log(this.searchEventUser);
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
            clone.setAttribute('style', 'width: ' + $scope.dragg.event.getBoundingClientRect().width + 'px');

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

                /**
                 * Filter list
                 */
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
            }else if(target === $scope.dragg.source){
                $scope.dragg.event.classList.remove('hdn');
            }

            /**
             * Reindex events
             */
            if(target && $scope.dragg.event){
                $scope.lists.filter((list:any) => {
                    if(list.id == target.getAttribute('data-list')){

                        let thisEvent = $scope.dragg.event.getAttribute('data-event');
                        let eventIndex  = $scope.dragg.index ? parseInt($scope.dragg.index.getAttribute('data-index')) : null;
                        let targetIndex = $scope.dragg.event ? parseInt($scope.dragg.event.getAttribute('data-index')): null;

                        list.events.filter((event:any) => {
                            if(event.id == thisEvent){
                                event.index = eventIndex;
                            }else if(event.id == $scope.dragg.index.getAttribute('data-event')){
                                event.index = targetIndex;
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

            /**
             * Save to locale storage
             */
            $scope.eventsStorage.setItem('events', JSON.stringify($scope.lists));

            /**
             * Remove placeholder
             */
            if (document.getElementsByClassName('placeholder').length > 0) {
                document.getElementsByClassName('placeholder')[0].remove();
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
            let thisEvent = el.closest('.event');

            if ($scope.dragInit == true) {
                let cloned = document.getElementsByClassName('cloned')[0];

                if (cloned) {
                    let left = (event.pageX - $scope.dragg.left);
                    let top = (event.pageY - $scope.dragg.top);
                    let target = el.closest('.list') ? el.closest('.list') : null;

                    cloned.classList.remove('hdn');
                    cloned.setAttribute('style', cloned.getAttribute('style') + '; left:' + left + 'px; top: ' + top + 'px');

                    /**
                     * Remove class active
                     */
                    document.querySelectorAll('.active').forEach(function (item) {
                        item.classList.remove('active');
                    });

                    if (target !== null) {
                        target.classList.add('active');
                    }

                    /**
                     * Remove over class
                     */
                    let over = document.getElementsByClassName('over');
                    if (over.length > 0) {
                        over[0].classList.remove('over');
                    }


                    /**
                     * Create placeholder
                     */
                    if (thisEvent && thisEvent !== $scope.dragg.event) {
                        if (thisEvent) {
                            let thisMiddle = thisEvent.getBoundingClientRect().top + (thisEvent.getBoundingClientRect().height / 2);

                            if (top < thisMiddle) {
                                Services.setPlaceholder(cloned, thisEvent, 'before');
                            } else if (top > thisMiddle) {
                                Services.setPlaceholder(cloned, thisEvent, 'after');
                            }
                            thisEvent.classList.add('over');
                            $scope.dragg.index = thisEvent;
                            $scope.dragg.event.classList.add('hdn');
                        }
                    }
                }
            }
        };
    });
