const angularEvents = require('angular');
const filterEvents = require('angular-filter');

angularEvents.module('appEvents', [filterEvents])
    .controller('eventsController', function ($scope: any, $http: any) {
        $scope.title = 'Events AngularJs';

        $scope.dragInit = false;

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
                    item.events.push({title: this.event.title});
                    item.addEvent = false;
                }
            });
        }

        /**
         * dragEventInit
         */
        $scope.dragEventInit = function (event:any) {
            $scope.dragInit = true;
            console.log($scope.dragInit);
        };

        $scope.dragEventDestroy = function (event:any) {
            $scope.dragInit = false;
            console.log($scope.dragInit);
        };

        $scope.dragMove = function (event:any) {
            let list = event.target;
            if($scope.dragInit == true){
                console.log(list);
            }
        };
    });