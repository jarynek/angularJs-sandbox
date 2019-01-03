const angularEvents = require('angular');
const filterEvents = require('angular-filter');

angularEvents.module('appEvents', [filterEvents])
    .controller('eventsController', function ($scope: any, $http: any) {
        $scope.title = 'Events AngularJs';

        $scope.dragInit = false;
        $scope.dragg = {
          left:null,
          top:null
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
                    item.events.push({title: this.event.title});
                    item.addEvent = false;
                }
            });
        };

        /**
         * dragEventInit
         */
        $scope.dragEventInit = function (event: any) {

            let el = event.target;
            let clone = el.closest('.draggable').cloneNode(true);
            let body = document.getElementsByTagName('body');

            if(!el){
                return;
            }

            $scope.dragInit = true;
            $scope.dragg.left = event.pageX - el.getBoundingClientRect().left;
            $scope.dragg.top = event.pageY - el.getBoundingClientRect().top;

            clone.classList.add('cloned', 'hdn');
            body[0].classList.add('lock');

            body[0].appendChild(clone);
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

            /**
             * Add event to list
             */
            if(target && cloned){
                let id = target.getAttribute('data-list');

                $scope.lists.filter((item:any)=>{
                   if(item.id == id){
                       item.events.push({title: 'sdfds'});
                       console.log(item);
                       console.log(cloned);
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

                if(cloned){
                    let left = (event.pageX - $scope.dragg.left);
                    let top = (event.pageY - $scope.dragg.top);
                    let target = el.closest('.list') ? el.closest('.list') : null;

                    cloned.classList.remove('hdn');
                    cloned.setAttribute('style', 'left:' + left + 'px; top: ' + top + 'px');

                    /**
                     * Remove class active
                     */
                    document.querySelectorAll('.active').forEach(function(item){
                        item.classList.remove('active');
                    });

                    if(target !== null){
                        let listId = target.getAttribute('data-list');

                        target.classList.add('active');
                        console.log(listId);
                    }
                }
            }
        };
    });