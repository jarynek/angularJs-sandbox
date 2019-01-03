class classController {

    title: string;
    name: string;
    $scope: any;

    constructor($scope: any) {

        this.$scope = $scope;
        this.$scope.title = 'Class AngularJs';
        this.$scope.name = 'anicka';
    }

    static getTest(event: any) {
        console.log(event.target.textContent);
    }
}

export default classController;