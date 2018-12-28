const angular = require('angular');

angular.module('appTest', [])

    .factory('Services', function () {
        return {
            userIdInit: false,
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
            getUserId: function (arg: any) {
                return arg.getAttribute('data-id');
            },
            getItems: (data: any) => {

                if (!data) {
                    return false;
                }

                let items: any = [];

                Object.keys(data).forEach((key) => {
                    items.push(
                        {
                            id: data[key].id,
                            title: data[key].title,
                            count: 0
                        }
                    );
                });

                return items;
            },
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
        $http.get('https://jsonplaceholder.typicode.com/posts')
            .then((response: any) => {
                $scope.items = Services.getItems(response.data);
            });

        /**
         * Get userName
         */
        $scope.name = 'jarek';

        /**
         * Get user id
         */
        $scope.getUserId = null;

        /**
         * Set userId
         */
        $scope.setUserId = (event: any) => {

            let thisEl = event.target.closest('li');
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

            let id = event.target.getAttribute('data-id');
            let data = $scope.items.find((item: any) => item.id == id);

            $scope.users.find((user: any) => {
                if (user.id == $scope.getUserId) {
                    user.items.push(data);
                }
            });
        };
    });