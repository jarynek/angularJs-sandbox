const angular = require('angular');
const filter = require('angular-filter');

angular.module('appTest', [filter])

    .factory('Services', function () {
        return {
            userIdInit: false,
            getUserId: function (arg: any) {
                return arg.getAttribute('data-id');
            },
            getUser: (data: any) => {

                if (!data) {
                    return false;
                }

                let users: any = [];

                Object.keys(data).forEach((key) => {
                    users.push(
                        {
                            id: data[key].id,
                            name: data[key].name,
                            username: data[key].username,
                            email: data[key].email,
                            items: [],
                            count: 1
                        }
                    );
                });

                return users;
            },
            getItems: (data: any) => {

                if (!data) {
                    return false;
                }

                let items: any = [];

                Object.keys(data).forEach((key) => {
                    items.push(
                        {
                            userId: data[key].userId,
                            id: data[key].id,
                            title: data[key].title,
                            completed: data[key].completed,
                            count: 0
                        }
                    );
                });

                return items;
            }
        }
    })

    /**
     * Users controller
     */
    .controller('usersController', function ($scope: any, $http: any, Services: any) {

        /**
         * Get users
         */
        $http.get('https://jsonplaceholder.typicode.com/users')
            .then(function (response: any) {
                $scope.users = Services.getUser(response.data);
            });

        /**
         * Get items
         */
        $http.get('https://jsonplaceholder.typicode.com/todos')
            .then((response: any) => {
                $scope.items = Services.getItems(response.data);
            });

        $scope.tasks = [];

        /**
         * Get userName
         */
        $scope.name = 'jarek';

        $scope.createTaskTpl = 'tpl/create.task.form.html';
        $scope.taskTpl = 'tpl/task.form.html';

        /**
         *
         * @param userId
         * @param itemId
         */
        $scope.getCount = (userId: any, itemId: any) => {
            let user = $scope.users.filter((user: any) => user.id == userId);
            let items = user[0].items.filter((item: any) => item.id == itemId);

            if (!user && !items) {
                return;
            }

            return items.length;
        };

        /**
         * Get user id
         */
        $scope.getUserId = null;

        /**
         * Get item id
         */
        $scope.getItemId = null;

        /**
         * Set userId
         */
        $scope.setUserId = (event: any) => {

            let thisEl = event.target.closest('li');

            if (!thisEl) {
                return;
            }

            let actives = document.querySelectorAll('.active');

            if (actives.length > 0) {
                actives.forEach((item) => {
                    item.classList.remove('active');
                });
            }

            thisEl.classList.add('active');

            $scope.getUserId = thisEl.getAttribute('data-id');
            Services.userIdInit = thisEl.getAttribute('data-id');

        };

        /**
         * setCount
         * @param {object} event
         */
        $scope.setCount = function (event: any) {

            let id = event.target.getAttribute('data-id');

            $scope.users.find((item: any) => {
                if (item.id == id) {
                    item.count++;
                }
            });
        };

        /**
         * setCountItem
         * @param {parseInt} userId
         * @param {parseInt} itemId
         * @param {object} event
         */
        $scope.setCountItem = (userId: any, itemId: any, event: any) => {
            console.log(userId);
            console.log(itemId);
            console.log(event);
        };

        /**
         * Set count change
         * @param {number} value
         */
        $scope.setCountChange = function (value: number) {
            $scope.users.find((item: any) => {
                if (item.id == $scope.getUserId) {
                    item.count = value;
                }
            });
        };

        /**
         *
         * @param {string} value
         */
        $scope.setName = function (value: any) {
            $scope.users.find((item: any) => {
                if (item.id == $scope.getUserId) {
                    item.name = value;
                }
            });
        };

        /**
         * Add item
         * @param {object} event
         */
        $scope.addItem = function (event: any) {

            if ($scope.getItemId == null) {
                return;
            }

            let userId:any = null;
            let itemId:any = null;

            if(event.type === 'mouseup'){
                userId = event.target.closest('[data-id]').getAttribute('data-id');
                itemId = $scope.getItemId;
            }else if(event.type === 'click'){
                userId = event.target.closest('[data-userId]').getAttribute('data-userId');
                itemId = event.target.closest('[data-id]').getAttribute('data-id');
            }

            let data = $scope.items.find((item: any) => item.id == itemId);

            $scope.users.find((user: any) => {
                if (user.id == userId) {
                    user.items.push(data);
                }
            });
        };

        /**
         * createItem
         * @param {object} event
         */
        $scope.createItem = function(event: any){
            alert('createItem');
            let parent = document.getElementById("items");
            let li = parent.querySelectorAll('.item')[0];

            li.cloneNode(true);
            document.getElementsByTagName('body')[0].appendChild(li);
        };

        $scope.createTask = function(event: any){
            event.preventDefault();

            let tasks = $scope.tasks.map((item:any) => item.id);
            let getId = !tasks.length ? 0 : Math.max(...tasks);

            $scope.tasks.push({
                id:getId+1,
                name:this.taskName,
                user:this.taskUser,
                description: this.taskDescription
            });

            console.log($scope.tasks);
        };

        /**
         * Add item
         * @param {object} event
         */
        $scope.removeItem = function (event: any) {

            let id = event.target.getAttribute('data-id');

            $scope.users.filter((user: any) => {
                if (user.id == $scope.getUserId) {
                    user.items.splice(user.items.findIndex((item: any) => item.id == id), 1);
                }
            });
        };

        /**
         * Drag object
         */
        $scope.dragg = {
            init: false
        };

        /**
         * dragInit
         * @param {object} event
         */
        $scope.dragInit = function (event: any) {

            $scope.dragg.init = true;
            let thisEl = event.target;
            $scope.getItemId = thisEl.getAttribute('data-id');
            let thisClone = thisEl.cloneNode(true);
            let thisBody = document.getElementsByTagName('body');

            document.body.appendChild(thisClone);

            thisClone.classList.add('cloned', 'hdn');
            thisBody[0].classList.add('dragged');

        };

        /**
         * dragDestroy
         * @param {object} event
         */
        $scope.dragDestroy = function (event: any) {

            let thisEl = event.target;
            let thisParent = thisEl.closest('[data-id]');
            let thisBody = document.getElementsByTagName('body');
            let thisClone = document.getElementsByClassName('cloned');

            if (!thisParent) {
                return;
            }

            if (thisClone.length > 0) {
                thisClone[0].remove();
            }

            if (thisBody[0].classList.contains('dragged') === true) {
                $scope.addItem(event);
            }
            thisBody[0].classList.remove('dragged');

            $scope.getUserId = thisEl.getAttribute('data-id');
            $scope.dragg.init = false;

            thisEl = null;
            thisParent = null;
            thisBody = null;
            thisClone = null;
        };

        /**
         * move
         * @param {object} event
         */
        $scope.move = function (event: any) {

            if ($scope.dragg.init === false) {
                return;
            }

            let thisTarget = event.target.closest('li');
            let thisClone = document.getElementsByClassName('cloned');
            let thisActives = document.querySelectorAll('.active');

            if (thisClone.length > 0) {
                thisClone[0].classList.remove('hdn');
                thisClone[0].setAttribute('style', 'left: ' + event.pageX + 'px; top:' + event.pageY + 'px');
            }

            if (thisActives.length > 0) {
                thisActives[0].classList.remove('active');
            }
            if (thisTarget) {
                thisTarget.classList.add('active');
            }
        };
    });