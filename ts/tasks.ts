let angularTask = require('angular');
let filterTask = require('angular-filter');

angularTask.module('appTasks', [filterTask])
    .factory('Services', function () {
        return {
            setTaskId: (scope:any)=>{
                let tasks = scope.tasks.map((item:any) => item.id);
                let getId = !tasks.length ? 0 : Math.max(...tasks);
                return getId;
            },
            setListTaskId: (arg: any)=>{
                let ids = [0];
                arg.map((item:any)=>{
                    item.tasks.map((task:any)=>{
                        ids.push(task.id);
                    });
                });
                return Math.max(...ids);
            }
        }

    })
    .controller('tasksController', function ($scope: any, Services:any) {

        $scope.name = 'tasks';
        $scope.dropInit = false;

        $scope.tpl = {
            addTask: 'tpl/add.task.form.html',
            editTask: 'tpl/edit.task.form.html',
            listAddTask: 'tpl/list.add.task.form.html',
        };

        $scope.tasksStorage = window.localStorage;
        $scope.tasksData = JSON.parse($scope.tasksStorage.getItem('tasks'));
        $scope.tasks = $scope.tasksData ? $scope.tasksData : [];
        $scope.lists = [
            {id:1, name:'One', addTask:null, tasks:[]},
            {id:2, name:'Two', addTask:null, tasks:[]},
            {id:3, name:'Three', addTask:null, tasks:[]}
        ];

        $scope.showAddTask = false;
        $scope.showEditTask = false;

        /**
         * Toggle class
         * @param arg
         */
        $scope.toggleClass = function (arg: any) {
            $scope.showAddTask = false;
            $scope.showEditTask = false;
        };

        /**
         * Add task
         * @param {obejct} event
         */
        $scope.addTask = function (event: any) {

            $scope.showAddTask = !$scope.showAddTask;
            console.log($scope.showAddTask);
        };

        /**
         * Save task
         * @param {obejct} event
         */
        $scope.saveTask = function (event: any) {

            event.preventDefault();

            let el = event.target;
            let action = el.getAttribute('data-action');

            /**
             * add task
             */
            if(action == 'add'){
                let id = Services.setTaskId($scope);

                $scope.tasks.push({id: id+1, name: this.taskName});
                $scope.showAddTask = false;
            }
            /**
             * dit task
             */
            else if (action == 'edit'){
                let id = event.target.getAttribute('data-task');
                $scope.tasks.filter((task:any)=>{
                    if(task.id == id){
                        task.name = this.taskName;
                    }
                });
                $scope.showEditTask = false;
            }

            $scope.tasksStorage.setItem('tasks', JSON.stringify($scope.tasks));
        };

        /**
         * Edit task
         * @param {object} event
         */
        $scope.editTask = function (event:any) {

            event.preventDefault();

            alert('sdfsdf');

            let thisItem = event.target;
            let id = thisItem.parentNode.getAttribute('data-task');

            if(!id){
                return;
            }

            $scope.task = $scope.tasks.filter((item:any) => item.id == id)[0];
            $scope.showEditTask = true;
        };

        /**
         * addListTask
         * @param {object} event
         */
        $scope.addListTask = function (event:any) {
            let el = event.target;
            let list = el.closest('.list').getAttribute('data-list');

            $scope.lists.filter((item:any)=>{
                if(item.id == list){
                    item.addTask = !item.addTask;
                }
            });
        };

        /**
         * Save list task
         * @param {object} event
         */
        $scope.saveListTask = function (event:any) {
            event.preventDefault();

            let el = event.target;
            let list = el.closest('.list').getAttribute('data-list');

            $scope.lists.filter((item:any)=>{
                if(item.id == list){
                    item.tasks.push({id:(Services.setListTaskId($scope.lists) + 1), name: this.taskName});
                    item.addTask = false;
                }
            });

            console.log($scope.lists);
        };

        $scope.dropAble = function (event:any) {
            $scope.dropInit = true;

            let body = document.getElementsByTagName('body');
            let el = event.target.closest('.task-card');

            body[0].classList.add('lock');
            el.classList.add('dragged');
        };

        $scope.moveAble = function (event:any) {
            if($scope.dropInit === true){
                let el = document.getElementsByClassName('dragged');
                el[0].setAttribute('style', 'left: ' + event.pageX + 'px; top:' + event.pageY + 'px');
            }
        };

        $scope.destroyDropAble = function (event:any) {
            let body = document.getElementsByTagName('body');
            let el = document.getElementsByClassName('dragged');

            body[0].classList.remove('lock');
            el[0].classList.remove('dragged');
            $scope.dropInit = false;
        };
    });