import Xhr from '../services/Xhr';
import {MovementService} from '../services/MovementService';

class usersController {

    $scope: any;
    $http: any;
    _xhr: any;
    addListName:any;
    movement:any;

    constructor($scope: any, $http: any) {
        this.$scope = $scope;
        this.$http = $http;
        this._xhr = new Xhr();

        this.$scope.name = 'users controller';
        this.$scope.title = 'Title for users controller';
        this.$scope.addList = false;
        this.$scope.movement = new MovementService(this.$scope);
        this.$scope.usersStorage = window.localStorage;

        /**
         * _getUsers
         */
        this._getUsers();
        this._clickOutside();
    }

    /**
     * _addList -> initialize form to add new list
     * @private
     */
    _addList(event: any) {
        event.preventDefault();
        event.stopPropagation();

        this.$scope.addList = !this.$scope.addList;
    }

    /**
     * _clickOutside
     * @private
     */
    _clickOutside() {
        document.addEventListener('click', (event:any) => {
            this.$scope.$apply(() => {

                let thisForm = event.target.closest('form');

                if(thisForm !== null){
                    return;
                }
                this.$scope.addList = false;
            });
        });
    }

    /**
     * _getUsers
     * @private
     */
    _getUsers() {

        /**
         * If users is in localstorage
         */
        if(this.$scope.usersStorage.getItem('users')){
            this.$scope.users = JSON.parse(this.$scope.usersStorage.getItem('users'));
            return;
        }
        /**
         * else if not
         */
        this.$http.get('https://jsonplaceholder.typicode.com/users')
            .then((response: any) => {
                this.$scope.users = response.data;
            });
    }

    /**
     * _save
     * @param {object} event
     * @private
     */
    _save(event:any){
        event.preventDefault();
    }
}

export default usersController;