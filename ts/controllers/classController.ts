import Xhr from '../services/Xhr';

class classController {

    title: string;
    name: string;
    $scope: any;
    _xhr:any;

    constructor($scope: any) {

        this.$scope = $scope;
        this.$scope.title = 'Class AngularJs';
        this.$scope.name = 'anicka';
        this._xhr = new Xhr();

        this._xhr.constructor.getData();
    }
}

export default classController;