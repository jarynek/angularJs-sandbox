let angularTask = require('angular');
let filterTask = require('angular-filter');

angularTask.module('appTasks', [filterTask])
    .factory('Services', function () {
        return {
            setTaskId: (scope:any)=>{
                let tasks = scope.tasks.map((item:any) => item.id);
                let getId = !tasks.length ? 0 : Math.max(...tasks);
                return getId;
            }
        }
    })
    .controller('tasksController', function ($scope: any, Services:any) {

        $scope.name = 'tasks';

        $scope.tpl = {
            addTask: 'tpl/add.task.form.html',
            editTask: 'tpl/edit.task.form.html',
        };

        $scope.tasksStorage = window.localStorage;
        $scope.tasksData = JSON.parse($scope.tasksStorage.getItem('tasks'));
        $scope.tasks = $scope.tasksData ? $scope.tasksData : [];

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

            let thisItem = event.target;
            let id = thisItem.parentNode.getAttribute('data-task');

            if(!id){
                return;
            }

            $scope.task = $scope.tasks.filter((item:any) => item.id == id)[0];
            $scope.showEditTask = true;
        }
    });